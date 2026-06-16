import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'

const BRIEF = {
  title: "Smart Door Lock SoC",
  description: "Design a chip for a smart door lock. Must run on a CR2032 coin battery for 2 years. Needs Bluetooth LE. Cost target: $2 per chip at 100K volume.",
  requirements: ["2 year battery life on CR2032", "Bluetooth LE connectivity", "< $2 unit cost at 100K volume", "Fingerprint sensor interface", "Tamper detection"]
}

const DECISIONS = [
  {
    id: 'node',
    title: 'Process Node',
    question: 'Which process node will you build on?',
    emoji: '⚙️',
    options: [
      { label: '180nm', desc: 'Cheap, proven, high power consumption', scores: { battery: 2, cost: 10, area: 2, time: 10 } },
      { label: '40nm', desc: 'Balanced — good power, reasonable cost', scores: { battery: 7, cost: 7, area: 6, time: 7 } },
      { label: '28nm', desc: 'Low power, moderate cost, ideal for IoT', scores: { battery: 9, cost: 6, area: 8, time: 6 } },
      { label: '7nm', desc: 'Overkill — great power but $$$', scores: { battery: 8, cost: 1, area: 10, time: 3 } },
    ]
  },
  {
    id: 'cpu',
    title: 'CPU Core',
    question: 'Which processor core will you use?',
    emoji: '🧠',
    options: [
      { label: 'ARM Cortex-M0+', desc: 'Ultra low power, perfect for IoT', scores: { battery: 10, cost: 8, area: 9, time: 8 } },
      { label: 'ARM Cortex-M4', desc: 'More powerful, higher power draw', scores: { battery: 5, cost: 6, area: 6, time: 7 } },
      { label: 'RISC-V RV32I', desc: 'Open source, royalty free, lean', scores: { battery: 8, cost: 10, area: 8, time: 6 } },
      { label: 'Custom state machine', desc: 'No CPU — pure hardware logic', scores: { battery: 10, cost: 10, area: 10, time: 2 } },
    ]
  },
  {
    id: 'memory',
    title: 'Memory Architecture',
    question: 'What memory setup will your chip use?',
    emoji: '💾',
    options: [
      { label: '32KB SRAM + 256KB Flash', desc: 'Standard combo, reliable', scores: { battery: 7, cost: 7, area: 7, time: 8 } },
      { label: '8KB SRAM + 128KB ROM', desc: 'Minimal — firmware baked in at fab', scores: { battery: 9, cost: 9, area: 9, time: 5 } },
      { label: '64KB SRAM only', desc: 'Fast but volatile — loses data on power off', scores: { battery: 4, cost: 6, area: 5, time: 9 } },
      { label: '16KB SRAM + 512KB Flash', desc: 'OTA update capable, more expensive', scores: { battery: 6, cost: 4, area: 5, time: 8 } },
    ]
  },
  {
    id: 'power',
    title: 'Power Strategy',
    question: 'How will you manage power consumption?',
    emoji: '🔋',
    options: [
      { label: 'Deep sleep + event wakeup', desc: 'Chip sleeps 99% of time, wakes on touch', scores: { battery: 10, cost: 7, area: 7, time: 7 } },
      { label: 'Duty cycling at 1Hz', desc: 'Polls sensors once per second', scores: { battery: 7, cost: 8, area: 8, time: 8 } },
      { label: 'Always-on low power mode', desc: 'Constant monitoring, higher drain', scores: { battery: 3, cost: 8, area: 8, time: 9 } },
      { label: 'Energy harvesting + battery', desc: 'Harvests from door vibration', scores: { battery: 10, cost: 3, area: 4, time: 4 } },
    ]
  },
  {
    id: 'package',
    title: 'Chip Package',
    question: 'How will your chip be packaged?',
    emoji: '📦',
    options: [
      { label: 'QFN-32', desc: 'Small, cheap, good thermal — PCB friendly', scores: { battery: 8, cost: 9, area: 8, time: 9 } },
      { label: 'WLCSP', desc: 'Wafer level — ultra tiny, direct on board', scores: { battery: 9, cost: 6, area: 10, time: 7 } },
      { label: 'BGA-64', desc: 'More pins, harder to solder at scale', scores: { battery: 7, cost: 5, area: 6, time: 6 } },
      { label: 'DIP-28', desc: 'Through hole — huge, cheap, easy to prototype', scores: { battery: 4, cost: 10, area: 2, time: 10 } },
    ]
  },
]

const SCORE_LABELS = {
  battery: { label: 'Battery Life', emoji: '🔋', good: 'Excellent — 2yr+ easily', bad: 'Poor — battery dies in months' },
  cost: { label: 'Unit Cost', emoji: '💰', good: 'Well under $2 target', bad: 'Over budget' },
  area: { label: 'Die Area', emoji: '📐', good: 'Compact — high yield', bad: 'Large — low yield' },
  time: { label: 'Time to Market', emoji: '⏱️', good: 'Ships on schedule', bad: 'Delayed launch' },
}

export default function TapeoutSprint() {
  const navigate = useNavigate()
  const location = useLocation()
  const student = location.state?.student
  const [screen, setScreen] = useState('brief')
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const alreadyDone = student ? localStorage.getItem(`tapeout-sprint-${student.roll_number}`) : false
  const startTime = useRef(Date.now())

  const handleSelect = (option) => {
    setSelections(prev => ({ ...prev, [DECISIONS[step].id]: option }))
  }

  const handleNext = () => {
    if (step < DECISIONS.length - 1) {
      setStep(s => s + 1)
    } else {
      handleFinish()
    }
  }

  const handleFinish = async () => {
    setScreen('result')
    if (submitted) return
    setSubmitted(true)

    const scores = calcScores()
    const timeTaken = Math.floor((Date.now() - startTime.current) / 1000)

    try {
      await supabase.from('tapeout_sprint_results').insert([{
        student_id: student.id,
        name: student.name,
        roll_number: student.roll_number,
        total_score: scores.total,
        battery_score: scores.battery,
        cost_score: scores.cost,
        area_score: scores.area,
        decisions: selections,
        time_taken: timeTaken,
      }])
    } catch (e) {
      console.error('Submit error', e)
    }
  }

  const calcScores = () => {
    const totals = { battery: 0, cost: 0, area: 0, time: 0 }
    Object.values(selections).forEach(opt => {
      Object.keys(totals).forEach(k => { totals[k] += opt.scores[k] })
    })
    const count = Object.keys(selections).length || 1
    Object.keys(totals).forEach(k => { totals[k] = Math.round(totals[k] / count) })
    totals.total = Math.round(Object.values(totals).reduce((a, b) => a + b, 0) / 4)
    return totals
  }

  const scores = calcScores()
  const decision = DECISIONS[step]
  const currentSelection = selections[decision?.id]

  const scoreBar = (key, value) => {
    const meta = SCORE_LABELS[key]
    const color = value >= 7 ? '#16a34a' : value >= 5 ? '#f59e0b' : '#dc2626'
    return (
      <div key={key} style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#666' }}>{meta.emoji} {meta.label}</span>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', fontWeight: 700, color }}>{value}/10</span>
        </div>
        <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${value * 10}%`, background: color, borderRadius: '99px', transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ fontSize: '10px', color: '#aaa', fontFamily: 'Space Mono, monospace', marginTop: '2px' }}>
          {value >= 7 ? meta.good : meta.bad}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2' }}>
      <style>{`@keyframes pop{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}`}</style>

      <div style={{ padding: '1.5rem 2.5rem 0', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/challenges', { state: { student } })} style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}>← back</button>
        {screen === 'decision' && <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#888' }}>decision {step + 1} / {DECISIONS.length}</div>}
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>

        {/* BRIEF */}
        {screen === 'brief' && (
          <div style={{ animation: 'pop 0.4s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⚙️</div>
              <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.2rem', fontWeight: 700, color: '#0f0f0f', marginBottom: '0.5rem' }}>Tapeout Sprint</h1>
              <p style={{ color: '#888', fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>Week 2 Challenge · Make 5 architectural decisions</p>
            </div>

            <div style={{ background: '#0f0f0f', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', color: '#fff' }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>product brief</div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.8rem' }}>{BRIEF.title}</h2>
              <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.2rem' }}>{BRIEF.description}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {BRIEF.requirements.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#aaa' }}>
                    <span style={{ color: '#22c55e' }}>✓</span> {r}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
              {Object.entries(SCORE_LABELS).map(([k, v]) => (
                <div key={k} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem' }}>{v.emoji}</div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#aaa', marginTop: '4px' }}>{v.label}</div>
                </div>
              ))}
            </div>

            <button onClick={() => setScreen('decision')} style={{ width: '100%', background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '12px', padding: '1rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
              Start designing →
            </button>
          </div>
        )}

        {/* DECISION */}
        {screen === 'decision' && (
          <div style={{ animation: 'pop 0.3s ease' }}>

            {/* Progress */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '2rem' }}>
              {DECISIONS.map((_, i) => (
                <div key={i} style={{ flex: 1, height: '4px', borderRadius: '99px', background: i <= step ? '#0f0f0f' : '#e5e7eb', transition: 'background 0.3s' }} />
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '1.5rem', alignItems: 'start' }}>
              <div>
                {/* Question */}
                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>{decision.emoji}</div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{decision.title}</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: 600, color: '#0f0f0f' }}>{decision.question}</div>
                </div>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {decision.options.map((opt, i) => {
                    const isSelected = currentSelection?.label === opt.label
                    return (
                      <button key={i} onClick={() => handleSelect(opt)} style={{
                        background: isSelected ? '#0f0f0f' : '#fff',
                        color: isSelected ? '#fff' : '#0f0f0f',
                        border: `1.5px solid ${isSelected ? '#0f0f0f' : 'rgba(0,0,0,0.08)'}`,
                        borderRadius: '12px',
                        padding: '1rem 1.2rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontFamily: 'Space Grotesk, sans-serif',
                        transition: 'all 0.15s',
                      }}>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '2px' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.82rem', opacity: 0.6 }}>{opt.desc}</div>
                        {isSelected && (
                          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                            {Object.entries(opt.scores).map(([k, v]) => (
                              <span key={k} style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.15)' }}>
                                {SCORE_LABELS[k].emoji} {v}/10
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={handleNext}
                  disabled={!currentSelection}
                  style={{ width: '100%', background: currentSelection ? '#0f0f0f' : '#e5e7eb', color: currentSelection ? '#fff' : '#aaa', border: 'none', borderRadius: '10px', padding: '0.9rem', fontSize: '0.95rem', fontWeight: 600, cursor: currentSelection ? 'pointer' : 'default', fontFamily: 'Space Grotesk, sans-serif', marginTop: '1rem', transition: 'all 0.2s' }}
                >
                  {step < DECISIONS.length - 1 ? 'Next decision →' : 'See my chip scorecard →'}
                </button>
              </div>

              {/* Live scorecard */}
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '1.2rem', position: 'sticky', top: '1rem' }}>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>live scorecard</div>
                {Object.keys(SCORE_LABELS).map(k => scoreBar(k, scores[k] || 0))}
                <div style={{ marginTop: '1rem', background: '#0f0f0f', borderRadius: '8px', padding: '0.8rem', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#555', marginBottom: '2px' }}>overall score</div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>{scores.total || 0}/10</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESULT */}
        {screen === 'result' && (
          <div style={{ animation: 'pop 0.5s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                {scores.total >= 8 ? '🏆' : scores.total >= 6 ? '✅' : scores.total >= 4 ? '😅' : '💀'}
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 700, color: '#0f0f0f', marginBottom: '0.4rem' }}>
                {scores.total >= 8 ? 'Silicon-grade design!' : scores.total >= 6 ? 'Solid chip architecture' : scores.total >= 4 ? 'Needs some rework' : 'Back to the drawing board'}
              </h2>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#aaa' }}>your chip scorecard for {BRIEF.title}</p>
            </div>

            {/* Overall score */}
            <div style={{ background: '#0f0f0f', borderRadius: '16px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '3.5rem', fontWeight: 700, color: scores.total >= 7 ? '#22c55e' : scores.total >= 5 ? '#f59e0b' : '#ef4444' }}>
                {scores.total}/10
              </div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#555', marginTop: '4px' }}>overall design score</div>
            </div>

            {/* Score breakdown */}
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.2rem' }}>score breakdown</div>
              {Object.keys(SCORE_LABELS).map(k => scoreBar(k, scores[k]))}
            </div>

            {/* Decisions summary */}
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>your chip design</div>
              {DECISIONS.map(d => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#aaa' }}>{d.emoji} {d.title}</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', fontWeight: 600, color: '#0f0f0f' }}>{selections[d.id]?.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => navigate('/challenges/leaderboard')} style={{ flex: 1, background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.9rem', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                🏆 Leaderboard
              </button>
              <button onClick={() => navigate('/challenges', { state: { student } })} style={{ flex: 1, background: '#fff', color: '#0f0f0f', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '0.9rem', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                Back to hub
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}