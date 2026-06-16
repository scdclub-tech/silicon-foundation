import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'

const CASE = {
  title: "Case #001 — The Thermal Runaway",
  chip: "NeuroEdge NPU — AI inference chip for automotive",
  symptoms: [
    "Works perfectly at room temperature (25°C)",
    "Fails consistently above 85°C junction temperature",
    "Power consumption 40% higher than datasheet spec",
    "Timing violations appearing on the critical path at high temp",
    "Failures are random — not at the same logic block each time"
  ]
}

const ROUND1 = {
  question: "Based on the symptoms, what is the most likely root cause?",
  hint: "Think about what changes at high temperature and could cause both timing violations AND higher power simultaneously.",
  options: [
    {
      label: "Electromigration in metal interconnects",
      correct: false,
      explanation: "Electromigration causes permanent open/short circuits over time — not temperature-dependent random failures. Good instinct but wrong mechanism here.",
      partial: 3
    },
    {
      label: "Process variation in transistor threshold voltage (Vt)",
      correct: true,
      explanation: "Correct! At high temp, carrier mobility drops and leakage current increases dramatically. This explains both the higher power AND timing violations — weaker drive strength means slower switching, violating setup times on the critical path.",
      partial: 10
    },
    {
      label: "ESD damage at I/O pads",
      correct: false,
      explanation: "ESD damage is permanent and shows up immediately — not temperature triggered. Also wouldn't explain system-wide timing violations.",
      partial: 2
    },
    {
      label: "Oxide breakdown in gate dielectric",
      correct: false,
      explanation: "Gate oxide breakdown is a reliability failure mode — it would cause permanent damage, not recoverable temperature-dependent failures.",
      partial: 2
    },
    {
      label: "Insufficient timing margin — setup violation",
      correct: false,
      explanation: "This describes the symptom, not the root cause. WHY is there a timing violation? You need to go one level deeper.",
      partial: 5
    },
  ]
}

const ROUND2_OPTIONS = {
  correct: [
    {
      label: "SPICE simulation at 85°C corner",
      result: "📊 Simulation confirms: at 85°C, drive strength drops 23% on critical path cells. Setup slack goes from +120ps to -45ps. This is your smoking gun.",
      score: 10
    },
    {
      label: "Thermal imaging of the die",
      result: "🌡️ Thermal map shows hotspots concentrated around the multiply-accumulate units — exactly where your critical path runs. Confirms thermal correlation.",
      score: 8
    },
  ],
  wrong: [
    {
      label: "IDDQ testing",
      result: "📉 IDDQ shows elevated leakage but can't pinpoint the timing root cause. Useful data but not the right test for this failure mode.",
      score: 3
    },
    {
      label: "Scan test at room temperature",
      result: "✅ All scan tests pass at 25°C — which you already knew. This test doesn't reproduce the failure condition.",
      score: 1
    },
    {
      label: "SEM imaging of metal layers",
      result: "🔬 SEM shows clean metal — no electromigration voids. Confirms it's not a physical damage issue but doesn't get you closer to the fix.",
      score: 2
    },
  ]
}

const ROUND3_OPTIONS = [
  {
    label: "ECO fix — upsize critical path cells",
    correct: true,
    explanation: "Best fix! Engineering Change Order to replace standard cells on the critical path with higher drive strength variants. No full respin needed — just a metal layer change. Ships in 6 weeks.",
    score: 10
  },
  {
    label: "Full chip respin at lower node",
    correct: false,
    explanation: "Overkill and expensive. A full respin takes 6-12 months and millions in NRE. The problem is fixable with a targeted ECO.",
    score: 2
  },
  {
    label: "Reduce operating temperature spec to 70°C",
    correct: false,
    explanation: "This is a workaround, not a fix. Your automotive customer requires 85°C operation — you can't just change the spec to hide the bug.",
    score: 1
  },
  {
    label: "Add voltage guardband — increase VDD by 10%",
    correct: false,
    explanation: "Raising voltage helps timing but increases power by ~21% (P∝V²). Already 40% over power budget — this makes it worse.",
    score: 3
  },
  {
    label: "Tighten design rules for next tapeout",
    correct: false,
    explanation: "This prevents future issues but doesn't fix the chip already in production. You still have angry automotive customers waiting.",
    score: 2
  },
]

export default function SiliconDetective() {
  const navigate = useNavigate()
  const location = useLocation()
  const student = location.state?.student
  const [screen, setScreen] = useState('intro')
  const [round, setRound] = useState(1)
  const [r1Choice, setR1Choice] = useState(null)
  const [r2Choices, setR2Choices] = useState([])
  const [r3Choice, setR3Choice] = useState(null)
  const [showR1Result, setShowR1Result] = useState(false)
  const [showR2Result, setShowR2Result] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const alreadyDone = student ? localStorage.getItem(`silicon-detective-${student.roll_number}`) : false
  const startTime = useRef(Date.now())

  const r1Score = r1Choice?.partial || 0
  const r2Score = r2Choices.reduce((a, c) => a + c.score, 0)
  const r3Score = r3Choice?.score || 0
  const totalScore = Math.min(100, Math.round((r1Score + Math.min(r2Score, 15) + r3Score) / 35 * 100))

  const handleR1Select = (opt) => {
    if (showR1Result) return
    setR1Choice(opt)
  }

  const handleR1Submit = () => {
    setShowR1Result(true)
  }

  const handleR2Toggle = (opt) => {
    if (showR2Result) return
    setR2Choices(prev =>
      prev.find(c => c.label === opt.label)
        ? prev.filter(c => c.label !== opt.label)
        : prev.length < 2 ? [...prev, opt] : prev
    )
  }

  const handleR2Submit = () => {
    setShowR2Result(true)
  }

  const handleFinish = async () => {
    setScreen('result')
    if (submitted) return
    setSubmitted(true)
    localStorage.setItem(`silicon-detective-${student.roll_number}`, 'done')
    const timeTaken = Math.floor((Date.now() - startTime.current) / 1000)
    try {
      await supabase.from('silicon_detective_results').insert([{
        student_id: student?.id,
        name: student?.name,
        roll_number: student?.roll_number,
        total_score: totalScore,
        diagnosis: r1Choice?.label,
        investigation: r2Choices.map(c => c.label).join(' + '),
        fix_chosen: r3Choice?.label,
        partial_credit: r1Score,
        time_taken: timeTaken,
      }])
    } catch (e) {
      console.error('Submit error', e)
    }
  }

  const allR2Options = [...ROUND2_OPTIONS.correct, ...ROUND2_OPTIONS.wrong].sort(() => Math.random() - 0.5)

   if (alreadyDone) return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2' }}>
        
  <div style={{ minHeight: '100vh', background: '#F7F6F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
      <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: '#0f0f0f', marginBottom: '0.8rem' }}>Already submitted!</h2>
      <p style={{ color: '#888', fontFamily: 'Space Mono, monospace', fontSize: '12px', lineHeight: 1.8, marginBottom: '2rem' }}>
        You've already completed Silicon Detective. Only one attempt is allowed per student. Check the leaderboard to see your ranking!
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
      <style>{`@keyframes pop{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}`}</style>

      <div style={{ padding: '1.5rem 2.5rem 0', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/challenges', { state: { student } })} style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}>← back</button>
        {screen === 'playing' && (
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#888' }}>round {round} / 3</div>
        )}
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem' }}>

        {/* INTRO */}
        {screen === 'intro' && (
          <div style={{ animation: 'pop 0.4s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔍</div>
              <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.2rem', fontWeight: 700, color: '#0f0f0f', marginBottom: '0.5rem' }}>Silicon Detective</h1>
              <p style={{ color: '#888', fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>Week 3 Challenge · 3 rounds of failure analysis</p>
            </div>

            {/* Case file */}
            <div style={{ background: '#0f0f0f', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', color: '#fff' }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>🗂️ case file</div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.3rem' }}>{CASE.title}</h2>
              <p style={{ color: '#666', fontSize: '12px', fontFamily: 'Space Mono, monospace', marginBottom: '1.2rem' }}>{CASE.chip}</p>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>observed symptoms</div>
              {CASE.symptoms.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '0.5rem', fontSize: '13px', color: '#aaa', alignItems: 'flex-start' }}>
                  <span style={{ color: '#ef4444', flexShrink: 0 }}>⚠</span> {s}
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
              {[['🎯', 'Round 1', 'Diagnose the root cause'], ['🔬', 'Round 2', 'Choose your investigation'], ['🔧', 'Round 3', 'Prescribe the fix']].map(([e, l, d]) => (
                <div key={l} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{e}</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', fontWeight: 600, color: '#0f0f0f', marginBottom: '2px' }}>{l}</div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#aaa' }}>{d}</div>
                </div>
              ))}
            </div>

            <button onClick={() => setScreen('playing')} style={{ width: '100%', background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '12px', padding: '1rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
              Open case file →
            </button>
          </div>
        )}

        {/* PLAYING */}
        {screen === 'playing' && (
          <div style={{ animation: 'pop 0.3s ease' }}>

            {/* Round indicator */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '2rem' }}>
              {[1, 2, 3].map(r => (
                <div key={r} style={{ flex: 1, height: '4px', borderRadius: '99px', background: r <= round ? '#0f0f0f' : '#e5e7eb', transition: 'background 0.3s' }} />
              ))}
            </div>

            {/* ROUND 1 */}
            {round === 1 && (
              <div>
                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>🎯 Round 1 — Diagnosis</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: 600, color: '#0f0f0f', marginBottom: '0.5rem' }}>{ROUND1.question}</div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#aaa', background: '#fafafa', padding: '0.75rem', borderRadius: '8px' }}>
                    💡 hint: {ROUND1.hint}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                  {ROUND1.options.map((opt, i) => {
                    const isSelected = r1Choice?.label === opt.label
                    const showResult = showR1Result
                    const bgColor = showResult
                      ? opt.correct ? '#F0FDF4' : isSelected ? '#FEF2F2' : '#fff'
                      : isSelected ? '#0f0f0f' : '#fff'
                    const textColor = showResult
                      ? opt.correct ? '#166534' : isSelected ? '#991b1b' : '#0f0f0f'
                      : isSelected ? '#fff' : '#0f0f0f'
                    const borderColor = showResult
                      ? opt.correct ? '#BBF7D0' : isSelected ? '#FECACA' : 'rgba(0,0,0,0.08)'
                      : isSelected ? '#0f0f0f' : 'rgba(0,0,0,0.08)'

                    return (
                      <button key={i} onClick={() => handleR1Select(opt)} style={{
                        background: bgColor, color: textColor,
                        border: `1.5px solid ${borderColor}`,
                        borderRadius: '12px', padding: '1rem 1.2rem',
                        textAlign: 'left', cursor: showR1Result ? 'default' : 'pointer',
                        fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem',
                        lineHeight: 1.5, transition: 'all 0.15s',
                      }}>
                        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', opacity: 0.5, marginRight: '8px' }}>{String.fromCharCode(65 + i)}.</span>
                        {opt.label}
                        {showResult && (opt.correct || isSelected) && (
                          <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8, lineHeight: 1.6 }}>{opt.explanation}</div>
                        )}
                      </button>
                    )
                  })}
                </div>

                {!showR1Result ? (
                  <button onClick={handleR1Submit} disabled={!r1Choice} style={{ width: '100%', background: r1Choice ? '#0f0f0f' : '#e5e7eb', color: r1Choice ? '#fff' : '#aaa', border: 'none', borderRadius: '10px', padding: '0.9rem', fontSize: '0.95rem', fontWeight: 600, cursor: r1Choice ? 'pointer' : 'default', fontFamily: 'Space Grotesk, sans-serif' }}>
                    Submit diagnosis →
                  </button>
                ) : (
                  <button onClick={() => setRound(2)} style={{ width: '100%', background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.9rem', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                    Proceed to investigation → {r1Choice?.correct ? '(+10 pts)' : `(+${r1Choice?.partial} pts)`}
                  </button>
                )}
              </div>
            )}

            {/* ROUND 2 */}
            {round === 2 && (
              <div>
                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>🔬 Round 2 — Investigation</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: 600, color: '#0f0f0f', marginBottom: '0.4rem' }}>
                    Choose up to 2 tests to run. What will give you the most useful data?
                  </div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#aaa' }}>
                    select 1 or 2 tests · choose wisely
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                  {allR2Options.map((opt, i) => {
                    const isSelected = r2Choices.find(c => c.label === opt.label)
                    const isCorrect = ROUND2_OPTIONS.correct.find(c => c.label === opt.label)
                    const bgColor = showR2Result
                      ? isCorrect ? '#F0FDF4' : isSelected ? '#FEF2F2' : '#fff'
                      : isSelected ? '#0f0f0f' : '#fff'
                    const textColor = showR2Result
                      ? isCorrect ? '#166534' : isSelected ? '#991b1b' : '#0f0f0f'
                      : isSelected ? '#fff' : '#0f0f0f'
                    const borderColor = showR2Result
                      ? isCorrect ? '#BBF7D0' : isSelected ? '#FECACA' : 'rgba(0,0,0,0.08)'
                      : isSelected ? '#0f0f0f' : 'rgba(0,0,0,0.08)'

                    return (
                      <button key={i} onClick={() => handleR2Toggle(opt)} style={{
                        background: bgColor, color: textColor,
                        border: `1.5px solid ${borderColor}`,
                        borderRadius: '12px', padding: '1rem 1.2rem',
                        textAlign: 'left', cursor: showR2Result ? 'default' : 'pointer',
                        fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem',
                        lineHeight: 1.5, transition: 'all 0.15s',
                      }}>
                        {opt.label}
                        {showR2Result && (isSelected || isCorrect) && (
                          <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8, lineHeight: 1.6 }}>{opt.result}</div>
                        )}
                      </button>
                    )
                  })}
                </div>

                {!showR2Result ? (
                  <button onClick={handleR2Submit} disabled={r2Choices.length === 0} style={{ width: '100%', background: r2Choices.length > 0 ? '#0f0f0f' : '#e5e7eb', color: r2Choices.length > 0 ? '#fff' : '#aaa', border: 'none', borderRadius: '10px', padding: '0.9rem', fontSize: '0.95rem', fontWeight: 600, cursor: r2Choices.length > 0 ? 'pointer' : 'default', fontFamily: 'Space Grotesk, sans-serif' }}>
                    Run tests →
                  </button>
                ) : (
                  <button onClick={() => setRound(3)} style={{ width: '100%', background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.9rem', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                    Prescribe the fix →
                  </button>
                )}
              </div>
            )}

            {/* ROUND 3 */}
            {round === 3 && (
              <div>
                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>🔧 Round 3 — The Fix</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: 600, color: '#0f0f0f', marginBottom: '0.4rem' }}>
                    You've identified the problem. What's your recommended fix?
                  </div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#aaa' }}>
                    automotive customer is waiting — choose carefully
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                  {ROUND3_OPTIONS.map((opt, i) => {
                    const isSelected = r3Choice?.label === opt.label
                    return (
                      <button key={i} onClick={() => !r3Choice && setR3Choice(opt)} style={{
                        background: isSelected ? '#0f0f0f' : '#fff',
                        color: isSelected ? '#fff' : '#0f0f0f',
                        border: `1.5px solid ${isSelected ? '#0f0f0f' : 'rgba(0,0,0,0.08)'}`,
                        borderRadius: '12px', padding: '1rem 1.2rem',
                        textAlign: 'left', cursor: r3Choice ? 'default' : 'pointer',
                        fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem',
                        lineHeight: 1.5, transition: 'all 0.15s',
                      }}>
                        {opt.label}
                        {isSelected && (
                          <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8, lineHeight: 1.6 }}>{opt.explanation}</div>
                        )}
                      </button>
                    )
                  })}
                </div>

                <button onClick={handleFinish} disabled={!r3Choice} style={{ width: '100%', background: r3Choice ? '#0f0f0f' : '#e5e7eb', color: r3Choice ? '#fff' : '#aaa', border: 'none', borderRadius: '10px', padding: '0.9rem', fontSize: '0.95rem', fontWeight: 600, cursor: r3Choice ? 'pointer' : 'default', fontFamily: 'Space Grotesk, sans-serif' }}>
                  Close the case →
                </button>
              </div>
            )}
          </div>
        )}

        {/* RESULT */}
        {screen === 'result' && (
          <div style={{ animation: 'pop 0.5s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                {totalScore >= 80 ? '🕵️' : totalScore >= 60 ? '✅' : totalScore >= 40 ? '😅' : '💀'}
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 700, color: '#0f0f0f', marginBottom: '0.4rem' }}>
                {totalScore >= 80 ? 'Master Detective!' : totalScore >= 60 ? 'Good analysis!' : totalScore >= 40 ? 'Partial credit' : 'Case unsolved'}
              </h2>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#aaa' }}>Case #001 — The Thermal Runaway</p>
            </div>

            {/* Score */}
            <div style={{ background: '#0f0f0f', borderRadius: '16px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '3.5rem', fontWeight: 700, color: totalScore >= 70 ? '#22c55e' : totalScore >= 50 ? '#f59e0b' : '#ef4444' }}>
                {totalScore}
              </div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#555', marginTop: '4px' }}>out of 100 points</div>
            </div>

            {/* Breakdown */}
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>score breakdown</div>
              {[
                { label: '🎯 Diagnosis', score: r1Score, max: 10, note: r1Choice?.label },
                { label: '🔬 Investigation', score: Math.min(r2Score, 15), max: 15, note: r2Choices.map(c => c.label).join(' + ') },
                { label: '🔧 Fix', score: r3Score, max: 10, note: r3Choice?.label },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#666' }}>{item.label}</span>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', fontWeight: 700, color: '#0f0f0f' }}>{item.score}/{item.max}</span>
                  </div>
                  <div style={{ height: '5px', background: '#f3f4f6', borderRadius: '99px', overflow: 'hidden', marginBottom: '4px' }}>
                    <div style={{ height: '100%', width: `${(item.score / item.max) * 100}%`, background: item.score >= item.max * 0.7 ? '#16a34a' : item.score >= item.max * 0.4 ? '#f59e0b' : '#ef4444', borderRadius: '99px' }} />
                  </div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#aaa' }}>{item.note}</div>
                </div>
              ))}
            </div>

            {/* Real answer reveal */}
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#1e40af', fontWeight: 700, marginBottom: '0.6rem' }}>📖 what actually happened</div>
              <p style={{ fontSize: '13px', color: '#1d4ed8', lineHeight: 1.8 }}>
                The NeuroEdge NPU had insufficient timing margin at the 85°C temperature corner. Process variation caused threshold voltage (Vt) to shift, reducing drive strength on the critical path by 23%. The correct fix was an ECO to upsize the 12 standard cells on the critical path — a metal-layer-only change that resolved the issue in 6 weeks without a full respin.
              </p>
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