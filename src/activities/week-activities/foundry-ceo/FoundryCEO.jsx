import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'

const SCENARIOS = [
  {
    id: 1,
    situation: "A major smartphone client needs 10M SoCs in 6 months. Your fab has capacity on 28nm and 7nm lines.",
    question: "Which node do you commit to?",
    options: [
      { label: "28nm — mature, high yield, fast delivery", value: "28nm", impact: { valuation: 15, yield: 8, satisfaction: 6, risk: -2 }, explanation: "Safe choice. 28nm has excellent yield and your team knows it well. Lower margin but reliable delivery." },
      { label: "7nm — premium pricing, higher margin", value: "7nm", impact: { valuation: 25, yield: -5, satisfaction: 8, risk: -8 }, explanation: "Bold move. Higher margin but 7nm yield is trickier and timeline is tight. High risk, high reward." },
      { label: "Negotiate for 12 months instead", value: "negotiate", impact: { valuation: 5, yield: 10, satisfaction: 3, risk: 5 }, explanation: "Conservative. You protect yield but may lose the client to a competitor who says yes." },
    ]
  },
  {
    id: 2,
    situation: "Mid-production, your yield suddenly drops from 89% to 61%. QA found particles in Bay 3 cleanroom.",
    question: "What do you do immediately?",
    options: [
      { label: "Halt Bay 3, deep clean, restart in 48hrs", value: "halt", impact: { valuation: -5, yield: 15, satisfaction: -3, risk: 8 }, explanation: "Correct engineering call. Short-term pain but you identify and fix the root cause properly." },
      { label: "Ship the 61% yield wafers — client needs them", value: "ship", impact: { valuation: 10, yield: -10, satisfaction: -8, risk: -12 }, explanation: "Dangerous. Short-term revenue boost but defective chips in the field destroy your reputation." },
      { label: "Run extra inspection, ship only passing dies", value: "inspect", impact: { valuation: 2, yield: 5, satisfaction: 4, risk: 2 }, explanation: "Balanced approach. Costs time and money but maintains quality without full halt." },
    ]
  },
  {
    id: 3,
    situation: "Samsung just announced a 3nm process with 15% better PPA than your best node. Your top client is asking questions.",
    question: "How do you respond competitively?",
    options: [
      { label: "Slash prices 20% to retain clients", value: "slash", impact: { valuation: -10, yield: 0, satisfaction: 8, risk: -5 }, explanation: "Defensive move. Buys loyalty but destroys margins. Not sustainable long term." },
      { label: "Accelerate R&D, announce 3nm roadmap", value: "accelerate", impact: { valuation: 20, yield: -5, satisfaction: 6, risk: -8 }, explanation: "Bold. Market loves the signal but R&D burn is real and roadmaps can slip." },
      { label: "Double down on mature nodes — different market", value: "mature", impact: { valuation: 8, yield: 8, satisfaction: 2, risk: 5 }, explanation: "Smart differentiation. Automotive and IoT don't need 3nm. Stable, profitable niche." },
    ]
  },
  {
    id: 4,
    situation: "Your EUV machine needs a $40M lens replacement. Insurance covers 60%. You have $18M cash reserves.",
    question: "How do you fund the repair?",
    options: [
      { label: "Take a bank loan — keep cash reserves", value: "loan", impact: { valuation: -5, yield: 5, satisfaction: 5, risk: -3 }, explanation: "Prudent. Preserves operational flexibility but adds debt and interest burden." },
      { label: "Raise equity from investors", value: "equity", impact: { valuation: 15, yield: 5, satisfaction: 5, risk: -5 }, explanation: "Dilutes ownership but no debt. Investors also bring strategic value and connections." },
      { label: "Use all cash reserves — avoid debt", value: "cash", impact: { valuation: -8, yield: 5, satisfaction: 5, risk: -10 }, explanation: "Risky. Depletes buffer. Any other emergency and you're in serious trouble." },
    ]
  },
  {
    id: 5,
    situation: "A government defense contractor offers a 5-year exclusive supply contract at 3× market rate — but you can't serve commercial clients during that period.",
    question: "Do you sign the exclusive deal?",
    options: [
      { label: "Sign it — guaranteed revenue for 5 years", value: "sign", impact: { valuation: 30, yield: 5, satisfaction: -5, risk: -8 }, explanation: "Financially attractive but you lose commercial market position and relationships for 5 years." },
      { label: "Decline — commercial market is the future", value: "decline", impact: { valuation: -5, yield: 0, satisfaction: 8, risk: 8 }, explanation: "Preserves commercial relationships and market position. Risky if commercial demand softens." },
      { label: "Negotiate non-exclusive at 2× rate", value: "negotiate", impact: { valuation: 18, yield: 3, satisfaction: 5, risk: 3 }, explanation: "Smart compromise. Lower rate but you keep commercial clients and diversify revenue." },
    ]
  },
]

const BASE = { valuation: 500, yield: 85, satisfaction: 70, risk: 50 }

export default function FoundryCEO() {
  const navigate = useNavigate()
  const location = useLocation()
  const student = location.state?.student
  const [screen, setScreen] = useState('intro')
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(null)
  const [metrics, setMetrics] = useState({ ...BASE })
  const [decisions, setDecisions] = useState([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [submitted, setSubmitted] = useState(false)
  const timerRef = useRef(null)
  const startTime = useRef(Date.now())

  const alreadyDone = student ? localStorage.getItem(`foundry-ceo-${student.roll_number}`) : false

  useEffect(() => {
    if (!student) navigate('/challenges')
  }, [student])

  useEffect(() => {
    if (screen !== 'playing' || showExplanation) return
    setTimeLeft(30)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleSelect(null)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [step, screen, showExplanation])

  const handleSelect = (option) => {
    clearInterval(timerRef.current)
    setSelected(option)
    setShowExplanation(true)
    if (option) {
      setMetrics(prev => ({
        valuation: Math.max(0, prev.valuation + option.impact.valuation),
        yield: Math.min(100, Math.max(0, prev.yield + option.impact.yield)),
        satisfaction: Math.min(100, Math.max(0, prev.satisfaction + option.impact.satisfaction)),
        risk: Math.min(100, Math.max(0, prev.risk + option.impact.risk)),
      }))
      setDecisions(prev => [...prev, { scenario: SCENARIOS[step].id, choice: option.value, time: 30 - timeLeft }])
    } else {
      setDecisions(prev => [...prev, { scenario: SCENARIOS[step].id, choice: 'timeout', time: 30 }])
    }
  }

  const handleNext = () => {
    setShowExplanation(false)
    setSelected(null)
    if (step < SCENARIOS.length - 1) {
      setStep(s => s + 1)
    } else {
      handleFinish()
    }
  }

  const handleFinish = async () => {
    setScreen('result')
    if (submitted) return
    setSubmitted(true)
    localStorage.setItem(`foundry-ceo-${student.roll_number}`, 'done')
    const timeTaken = Math.floor((Date.now() - startTime.current) / 1000)
    const finalValuation = metrics.valuation * 10000000
    try {
      await supabase.from('foundry_ceo_results').insert([{
        student_id: student.id,
        name: student.name,
        roll_number: student.roll_number,
        final_valuation: finalValuation,
        decisions: decisions,
        time_taken: timeTaken,
      }])
    } catch (e) {
      console.error('Submit error', e)
    }
  }

  const metricBar = (label, value, color) => (
    <div style={{ marginBottom: '0.6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#888' }}>{label}</span>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#0f0f0f', fontWeight: 700 }}>{value}</span>
      </div>
      <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(100, (value / (label === 'Valuation' ? 600 : 100)) * 100)}%`, background: color, borderRadius: '99px', transition: 'width 0.5s ease' }} />
      </div>
    </div>
  )

  const scenario = SCENARIOS[step]
  const timerPct = (timeLeft / 30) * 100
  const timerColor = timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#f59e0b' : '#ef4444'

  // ✅ CORRECT POSITION — before the main return
  if (alreadyDone) return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: '#0f0f0f', marginBottom: '0.8rem' }}>Already submitted!</h2>
        <p style={{ color: '#888', fontFamily: 'Space Mono, monospace', fontSize: '12px', lineHeight: 1.8, marginBottom: '2rem' }}>
          You've already completed Foundry CEO. Only one attempt is allowed per student. Check the leaderboard to see your ranking!
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button onClick={() => navigate('/challenges/leaderboard')} style={{ background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.9rem 1.5rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
            🏆 View leaderboard
          </button>
          <button onClick={() => navigate('/challenges')} style={{ background: '#fff', color: '#0f0f0f', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '0.9rem 1.5rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
            Back to hub
          </button>
        </div>
      </div>
    </div>
  )

  // ✅ MAIN return — completely separate
  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2' }}>
      <style>{`@keyframes pop{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}`}</style>
      <div style={{ padding: '1.5rem 2.5rem 0', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/challenges')} style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}>← back</button>
        {screen === 'playing' && <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#888' }}>scenario {step + 1} / {SCENARIOS.length}</div>}
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem' }}>

        {/* INTRO */}
        {screen === 'intro' && (
          <div style={{ textAlign: 'center', animation: 'pop 0.4s ease' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏭</div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.2rem', fontWeight: 700, color: '#0f0f0f', marginBottom: '0.8rem' }}>Foundry CEO</h1>
            <p style={{ color: '#666', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1rem', lineHeight: 1.8 }}>
              You've just been hired as CEO of <strong>SiliconForge Inc.</strong> — a mid-tier fab fighting for market share. Make 5 critical decisions that will determine your company's fate.
            </p>
            <p style={{ color: '#aaa', fontFamily: 'Space Mono, monospace', fontSize: '12px', marginBottom: '2.5rem' }}>
              30 seconds per decision · no second chances · your score goes on the leaderboard
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
              {[['💰', 'Valuation', '$500M'], ['⚗️', 'Yield', '85%'], ['😊', 'Satisfaction', '70%'], ['⚠️', 'Risk', '50%']].map(([e, l, v]) => (
                <div key={l} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '0.8rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem' }}>{e}</div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#aaa', margin: '4px 0 2px' }}>{l}</div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', fontWeight: 700, color: '#0f0f0f' }}>{v}</div>
                </div>
              ))}
            </div>
            <button onClick={() => { setScreen('playing'); startTime.current = Date.now() }} style={{ background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '10px', padding: '1rem 3rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
              Take the CEO chair →
            </button>
          </div>
        )}

        {/* PLAYING */}
        {screen === 'playing' && (
          <div style={{ animation: 'pop 0.3s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1.5rem', alignItems: 'start' }}>
              <div>
                {!showExplanation && (
                  <div style={{ marginBottom: '1.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#aaa' }}>time remaining</span>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: timerColor, fontWeight: 700 }}>{timeLeft}s</span>
                    </div>
                    <div style={{ height: '4px', background: '#f3f4f6', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${timerPct}%`, background: timerColor, borderRadius: '99px', transition: 'width 1s linear' }} />
                    </div>
                  </div>
                )}

                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>situation</div>
                  <p style={{ fontSize: '0.95rem', color: '#0f0f0f', lineHeight: 1.7, marginBottom: '1rem' }}>{scenario.situation}</p>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#0f0f0f' }}>{scenario.question}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {scenario.options.map((opt, i) => {
                    const isSelected = selected?.value === opt.value
                    return (
                      <button key={i} onClick={() => !showExplanation && handleSelect(opt)} style={{
                        background: isSelected ? '#0f0f0f' : '#fff',
                        color: isSelected ? '#fff' : '#0f0f0f',
                        border: `1.5px solid ${isSelected ? '#0f0f0f' : 'rgba(0,0,0,0.08)'}`,
                        borderRadius: '12px',
                        padding: '1rem 1.2rem',
                        textAlign: 'left',
                        cursor: showExplanation ? 'default' : 'pointer',
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        transition: 'all 0.15s',
                      }}>
                        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', opacity: 0.5, marginRight: '8px' }}>{String.fromCharCode(65 + i)}.</span>
                        {opt.label}
                      </button>
                    )
                  })}
                </div>

                {showExplanation && selected && (
                  <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '1.2rem', marginTop: '1rem', animation: 'pop 0.3s ease' }}>
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#16a34a', fontWeight: 700, marginBottom: '0.4rem' }}>📊 analysis</div>
                    <p style={{ fontSize: '13px', color: '#166534', lineHeight: 1.7, marginBottom: '0.8rem' }}>{selected.explanation}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {Object.entries(selected.impact).map(([k, v]) => (
                        <span key={k} style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: v > 0 ? '#dcfce7' : '#fee2e2', color: v > 0 ? '#16a34a' : '#dc2626' }}>
                          {k} {v > 0 ? '+' : ''}{v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {showExplanation && (
                  <button onClick={handleNext} style={{ width: '100%', background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.9rem', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', marginTop: '1rem' }}>
                    {step < SCENARIOS.length - 1 ? 'Next scenario →' : 'See final results →'}
                  </button>
                )}
              </div>

              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '1.2rem', position: 'sticky', top: '1rem' }}>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>your metrics</div>
                {metricBar('Valuation', metrics.valuation, '#2563EB')}
                {metricBar('Yield %', metrics.yield, '#16a34a')}
                {metricBar('Client Sat.', metrics.satisfaction, '#f59e0b')}
                {metricBar('Risk Score', metrics.risk, '#ef4444')}
                <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#0f0f0f', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#666', marginBottom: '2px' }}>company value</div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                    ${(metrics.valuation * 10).toFixed(0)}M
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESULT */}
        {screen === 'result' && (
          <div style={{ textAlign: 'center', animation: 'pop 0.5s ease' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
              {metrics.valuation > 550 ? '🚀' : metrics.valuation > 480 ? '✅' : metrics.valuation > 400 ? '😅' : '📉'}
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 700, color: '#0f0f0f', marginBottom: '0.4rem' }}>
              {metrics.valuation > 550 ? 'You crushed it!' : metrics.valuation > 480 ? 'Solid CEO!' : metrics.valuation > 400 ? 'Room to grow' : 'Tough quarter'}
            </h2>
            <p style={{ color: '#888', fontFamily: 'Space Mono, monospace', fontSize: '12px', marginBottom: '2rem' }}>
              SiliconForge final valuation
            </p>
            <div style={{ background: '#0f0f0f', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '3rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem' }}>
                ${(metrics.valuation * 10).toFixed(0)}M
              </div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#555' }}>company valuation</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
              {[['Yield', metrics.yield + '%', '#16a34a'], ['Client Sat.', metrics.satisfaction + '%', '#f59e0b'], ['Risk', metrics.risk + '%', '#ef4444']].map(([l, v, c]) => (
                <div key={l} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>{l}</div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '1.3rem', fontWeight: 700, color: c }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => navigate('/challenges/leaderboard')} style={{ background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.9rem 2rem', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                🏆 View leaderboard
              </button>
              <button onClick={() => navigate('/challenges')} style={{ background: '#fff', color: '#0f0f0f', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '0.9rem 2rem', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                Back to hub
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}