import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STOPS = [
  { label: 'Human Hair', size: '70,000 nm', fact: 'A single strand of human hair is about 70 micrometers wide — roughly 10,000× wider than a modern transistor.', color: '#f59e0b', emoji: '🧑', scale: '70,000 nm wide' },
  { label: 'Red Blood Cell', size: '8,000 nm', fact: 'A red blood cell is 8 micrometers across. It carries oxygen through your blood and is still thousands of times larger than a transistor.', color: '#ef4444', emoji: '🩸', scale: '8,000 nm wide' },
  { label: 'Bacterium', size: '1,000 nm', fact: 'A typical bacterium is about 1 micron long. Early 1970s transistors were roughly this size — we\'ve come a long way.', color: '#84cc16', emoji: '🦠', scale: '1,000 nm wide' },
  { label: 'Virus', size: '100 nm', fact: 'A coronavirus is about 100nm across. The 90nm chip node from 2004 was already smaller than most viruses.', color: '#a78bfa', emoji: '🔵', scale: '100 nm wide' },
  { label: 'DNA Strand', size: '2.5 nm', fact: 'A DNA double helix is just 2.5nm wide. Modern 3nm transistors are now comparable to the molecules of life itself.', color: '#34d399', emoji: '🧬', scale: '2.5 nm wide' },
  { label: '3nm Transistor', size: '3 nm', fact: 'A modern transistor gate is just a few nanometers. Apple\'s M3 chip packs over 25 billion of these into a thumbnail-sized die.', color: '#2563EB', emoji: '⚡', scale: '~3 nm' },
  { label: 'Silicon Atom', size: '0.22 nm', fact: 'A silicon atom is 0.22nm wide. We are now building transistors just 10–15 atoms across. This is the physical limit of silicon.', color: '#f97316', emoji: '⚛️', scale: '0.22 nm wide' },
]

export default function SizeOfTransistor() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const containerRef = useRef(null)

  const goTo = (idx) => {
    if (animating || idx === current) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(idx)
      setAnimating(false)
    }, 300)
  }

  const next = () => { if (current < STOPS.length - 1) goTo(current + 1) }
  const prev = () => { if (current > 0) goTo(current - 1) }

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next()
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [current, animating])

  const stop = STOPS[current]
  const progress = current / (STOPS.length - 1)

  // Visual size of the circle — gets smaller as we zoom in
  const circleSize = 220 - current * 26

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.4} 100%{transform:scale(1.6);opacity:0} }
      `}</style>

      {/* Nav */}
      <div style={{ padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/')} style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#666', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em' }}>
          ← back
        </button>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          the size of a transistor
        </div>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#444' }}>
          {current + 1} / {STOPS.length}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', gap: '0', overflow: 'hidden' }}>

        {/* Left — timeline */}
        <div style={{ width: '200px', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '10px', fontFamily: 'Space Mono, monospace', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>zoom scale</div>
          {STOPS.map((s, i) => (
            <button key={i} onClick={() => goTo(i)} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0', textAlign: 'left', position: 'relative' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: current === i ? s.color : '#333', border: current === i ? `2px solid ${s.color}` : '2px solid #444', flexShrink: 0, transition: 'all 0.3s', boxShadow: current === i ? `0 0 8px ${s.color}` : 'none' }} />
              <div style={{ fontSize: '11px', fontFamily: 'Space Mono, monospace', color: current === i ? '#fff' : '#555', transition: 'color 0.3s', lineHeight: 1.3 }}>
                <div style={{ color: current === i ? s.color : '#555' }}>{s.label}</div>
                <div style={{ fontSize: '10px', color: '#444', marginTop: '1px' }}>{s.size}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Center — visual */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>

          {/* Scale bar */}
          <div style={{ position: 'absolute', top: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.04)', borderRadius: '99px', padding: '6px 16px' }}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#666' }}>
              viewing at scale: <span style={{ color: stop.color }}>{stop.scale}</span>
            </div>
          </div>

          {/* Circle visualization */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem' }}>
            {/* Pulse rings */}
            <div style={{ position: 'absolute', width: circleSize + 'px', height: circleSize + 'px', borderRadius: '50%', border: `1px solid ${stop.color}`, animation: 'pulse-ring 2s ease-out infinite', opacity: 0.4 }} />
            <div style={{ position: 'absolute', width: circleSize + 'px', height: circleSize + 'px', borderRadius: '50%', border: `1px solid ${stop.color}`, animation: 'pulse-ring 2s ease-out infinite 1s', opacity: 0.4 }} />

            {/* Main circle */}
            <div style={{
              width: circleSize + 'px',
              height: circleSize + 'px',
              borderRadius: '50%',
              background: `radial-gradient(circle at 35% 35%, ${stop.color}33, ${stop.color}11)`,
              border: `2px solid ${stop.color}66`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: current > 4 ? '2.5rem' : '4rem',
              animation: animating ? 'none' : 'fadeIn 0.4s ease',
              transition: 'width 0.5s ease, height 0.5s ease, background 0.5s ease, border-color 0.5s ease',
              boxShadow: `0 0 60px ${stop.color}22`,
            }}>
              {stop.emoji}
            </div>
          </div>

          {/* Label + size */}
          <div style={{ textAlign: 'center', animation: animating ? 'none' : 'fadeIn 0.4s ease', maxWidth: '500px' }}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: stop.color, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {stop.size}
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', fontFamily: 'Space Grotesk, sans-serif' }}>
              {stop.label}
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#888', lineHeight: 1.8, marginBottom: '2.5rem' }}>
              {stop.fact}
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', maxWidth: '400px', marginBottom: '2rem' }}>
            <div style={{ height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress * 100}%`, background: stop.color, transition: 'width 0.5s ease, background 0.5s ease', borderRadius: '99px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#444' }}>
              <span>70,000 nm</span><span>← zooming in →</span><span>0.22 nm</span>
            </div>
          </div>

          {/* Nav buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={prev} disabled={current === 0} style={{ background: 'rgba(255,255,255,0.06)', color: current === 0 ? '#333' : '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem 1.5rem', fontSize: '13px', cursor: current === 0 ? 'default' : 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
              ← zoom out
            </button>
            <button onClick={next} disabled={current === STOPS.length - 1} style={{ background: current === STOPS.length - 1 ? 'rgba(255,255,255,0.04)' : stop.color, color: '#fff', border: 'none', borderRadius: '10px', padding: '0.75rem 1.5rem', fontSize: '13px', cursor: current === STOPS.length - 1 ? 'default' : 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, transition: 'background 0.3s' }}>
              zoom in →
            </button>
          </div>

          <div style={{ marginTop: '1rem', fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#333' }}>
            use arrow keys to navigate
          </div>
        </div>
      </div>
    </div>
  )
}