import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const LEVELS = [
  { bits: 4, time: 8, label: '4-bit' },
  { bits: 6, time: 7, label: '6-bit' },
  { bits: 8, time: 6, label: '8-bit' },
]

function generateBinary(bits) {
  const num = Math.floor(Math.random() * (Math.pow(2, bits) - 1)) + 1
  return { binary: num.toString(2).padStart(bits, '0'), answer: num }
}

export default function BinaryBlitz() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState('intro') // intro | playing | correct | wrong | gameover
  const [level, setLevel] = useState(0)
  const [question, setQuestion] = useState(null)
  const [input, setValue] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('bb-best') || '0'))
  const [feedback, setFeedback] = useState(null)
  const [questionNum, setQuestionNum] = useState(0)
  const timerRef = useRef(null)
  const inputRef = useRef(null)

  const nextQuestion = useCallback((currentLevel) => {
    const lvl = LEVELS[currentLevel]
    const q = generateBinary(lvl.bits)
    setQuestion(q)
    setTimeLeft(lvl.time)
    setValue('')
    setScreen('playing')
    setFeedback(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const endGame = useCallback((currentScore) => {
    clearInterval(timerRef.current)
    if (currentScore > best) {
      setBest(currentScore)
      localStorage.setItem('bb-best', currentScore)
    }
    setScreen('gameover')
  }, [best])

  const handleCorrect = useCallback((currentScore, currentStreak, currentLevel, currentQuestionNum) => {
    clearInterval(timerRef.current)
    const newScore = currentScore + 10 + currentStreak * 2
    const newStreak = currentStreak + 1
    const newQNum = currentQuestionNum + 1
    setScore(newScore)
    setStreak(newStreak)
    setQuestionNum(newQNum)
    setScreen('correct')
    setFeedback(`+${10 + currentStreak * 2} pts${currentStreak > 0 ? ` (${currentStreak}x streak!)` : ''}`)

    const newLevel = newQNum > 0 && newQNum % 5 === 0 ? Math.min(currentLevel + 1, LEVELS.length - 1) : currentLevel
    setLevel(newLevel)
    setTimeout(() => nextQuestion(newLevel), 900)
  }, [nextQuestion])

  const handleWrong = useCallback((currentScore) => {
    clearInterval(timerRef.current)
    setStreak(0)
    setScreen('wrong')
    setTimeout(() => endGame(currentScore), 1200)
  }, [endGame])

  useEffect(() => {
    if (screen !== 'playing') return
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleWrong(score)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [screen, question])

  const handleSubmit = () => {
    if (!input.trim() || screen !== 'playing') return
    const guess = parseInt(input)
    if (guess === question.answer) {
      handleCorrect(score, streak, level, questionNum)
    } else {
      handleWrong(score)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const startGame = () => {
    setScore(0)
    setStreak(0)
    setLevel(0)
    setQuestionNum(0)
    nextQuestion(0)
  }

  const timerPct = question ? (timeLeft / LEVELS[level].time) * 100 : 100
  const timerColor = timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes pop { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
        @keyframes flash-green { 0%,100%{background:#F7F6F2} 50%{background:#dcfce7} }
        @keyframes flash-red { 0%,100%{background:#F7F6F2} 50%{background:#fee2e2} }
        .bit-char { display:inline-block; transition: color 0.2s; }
      `}</style>

      {/* Back button */}
      <div style={{ padding: '1.5rem 2.5rem 0' }}>
        <button onClick={() => navigate('/')} style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em' }}>
          ← back to activities
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>

        {/* INTRO SCREEN */}
        {screen === 'intro' && (
          <div style={{ textAlign: 'center', animation: 'pop 0.4s ease' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚡</div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.5rem', fontWeight: 700, color: '#0f0f0f', marginBottom: '0.5rem' }}>Binary Blitz</h1>
            <p style={{ color: '#666', fontSize: '1rem', marginBottom: '0.5rem', maxWidth: '380px' }}>
              A binary number flashes on screen. Convert it to decimal before the timer runs out.
            </p>
            <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '2.5rem', fontFamily: 'Space Mono, monospace' }}>
              gets harder every 5 questions
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              {LEVELS.map((l, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '0.8rem 1.2rem', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: 700, color: '#0f0f0f' }}>{l.label}</div>
                  <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{l.time}s per question</div>
                </div>
              ))}
            </div>

            <button onClick={startGame} style={{ background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '10px', padding: '1rem 3rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.02em' }}>
              Start playing →
            </button>

            {best > 0 && (
              <div style={{ marginTop: '1.5rem', fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#aaa' }}>
                personal best: <strong style={{ color: '#0f0f0f' }}>{best} pts</strong>
              </div>
            )}
          </div>
        )}

        {/* PLAYING SCREEN */}
        {(screen === 'playing' || screen === 'correct' || screen === 'wrong') && question && (
          <div style={{ textAlign: 'center', width: '100%', maxWidth: '560px', animation: screen === 'playing' ? 'pop 0.3s ease' : screen === 'wrong' ? 'shake 0.4s ease' : undefined }}>

            {/* Score + streak bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '0.8rem 1.2rem' }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', color: '#888' }}>
                score <strong style={{ color: '#0f0f0f' }}>{score}</strong>
              </div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#aaa' }}>
                {LEVELS[level].label} mode
              </div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', color: '#888' }}>
                streak <strong style={{ color: streak > 2 ? '#f59e0b' : '#0f0f0f' }}>{streak}🔥</strong>
              </div>
            </div>

            {/* Timer bar */}
            <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '99px', marginBottom: '2.5rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${timerPct}%`, background: timerColor, borderRadius: '99px', transition: 'width 1s linear, background 0.5s ease' }} />
            </div>

            {/* Level badge */}
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#aaa', marginBottom: '1rem' }}>
              convert to decimal — {timeLeft}s
            </div>

            {/* Binary number */}
            <div style={{
              fontSize: 'clamp(2rem, 8vw, 4.5rem)',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: screen === 'correct' ? '#16a34a' : screen === 'wrong' ? '#dc2626' : '#0f0f0f',
              marginBottom: '2rem',
              transition: 'color 0.2s',
              lineHeight: 1.2,
            }}>
              {question.binary.split('').map((bit, i) => (
                <span key={i} className="bit-char" style={{ color: bit === '1' ? (screen === 'correct' ? '#16a34a' : screen === 'wrong' ? '#dc2626' : '#2563EB') : undefined }}>
                  {bit}
                </span>
              ))}
            </div>

            {/* Feedback */}
            {feedback && screen === 'correct' && (
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', color: '#16a34a', marginBottom: '1rem', animation: 'pop 0.3s ease' }}>
                ✓ correct! {feedback}
              </div>
            )}
            {screen === 'wrong' && (
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', color: '#dc2626', marginBottom: '1rem' }}>
                ✗ answer was <strong>{question.answer}</strong>
              </div>
            )}

            {/* Input */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <input
                ref={inputRef}
                type="number"
                value={input}
                onChange={e => setValue(e.target.value)}
                onKeyDown={handleKey}
                disabled={screen !== 'playing'}
                placeholder="your answer"
                style={{
                  width: '180px',
                  padding: '0.85rem 1rem',
                  fontSize: '1.1rem',
                  fontFamily: 'Space Mono, monospace',
                  border: '1.5px solid rgba(0,0,0,0.12)',
                  borderRadius: '10px',
                  outline: 'none',
                  background: '#fff',
                  textAlign: 'center',
                  color: '#0f0f0f',
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={screen !== 'playing'}
                style={{ background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.85rem 1.5rem', fontSize: '1rem', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, opacity: screen !== 'playing' ? 0.5 : 1 }}
              >
                Submit
              </button>
            </div>

            {/* Hint */}
            <div style={{ marginTop: '1.5rem', fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#ccc' }}>
              press Enter to submit
            </div>
          </div>
        )}

        {/* GAME OVER SCREEN */}
        {screen === 'gameover' && (
          <div style={{ textAlign: 'center', animation: 'pop 0.5s ease' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{score > best ? '🏆' : '💀'}</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 700, color: '#0f0f0f', marginBottom: '0.5rem' }}>
              {score > best ? 'New best!' : 'Game over'}
            </h2>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '2rem 0', flexWrap: 'wrap' }}>
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '1.2rem 2rem', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '2rem', fontWeight: 700, color: '#0f0f0f' }}>{score}</div>
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>your score</div>
              </div>
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '1.2rem 2rem', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>{Math.max(score, best)}</div>
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>personal best</div>
              </div>
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '1.2rem 2rem', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '2rem', fontWeight: 700, color: '#2563EB' }}>{questionNum}</div>
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>questions answered</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={startGame} style={{ background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.9rem 2rem', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                Play again
              </button>
              <button onClick={() => navigate('/')} style={{ background: '#fff', color: '#0f0f0f', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '10px', padding: '0.9rem 2rem', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                Back to home
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}