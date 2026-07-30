import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { activities } from '../data/activities'

export default function Playground() {
  const navigate = useNavigate()
  const countRef = useRef(null)

  useEffect(() => {
    const base = 1e12
    const rate = 1500000
    const start = Date.now()
    const interval = setInterval(() => {
      const count = base + ((Date.now() - start) * rate) / 1000
      if (countRef.current) {
        countRef.current.textContent = Math.floor(count).toLocaleString('en-US')
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <style>{`
        .activity-card { background: #F7F6F2; transition: background 0.15s ease; cursor: pointer; padding: 2rem 1.8rem; position: relative; overflow: hidden; border: none; text-align: left; width: 100%; }
        .activity-card:hover { background: #ffffff; }
        .activity-card:hover .card-arrow { opacity: 1; transform: translate(2px, -2px); }
        .card-arrow { position: absolute; top: 1.4rem; right: 1.4rem; font-size: 14px; color: #aaa; opacity: 0; transition: all 0.15s ease; }
        .tag-game { background: #FFF1F2; color: #9F1239; }
        .tag-sim { background: #F0FDF4; color: #166534; }
        .tag-viz { background: #FFF7ED; color: #9A3412; }
        .tag-tool { background: #FAF5FF; color: #7E22CE; }
        .tag-quiz { background: #F9FAFB; color: #374151; }
        .tag-soon { background: rgba(20,20,15,0.06); color: #6B6B60; }
        .activity-card--soon { opacity: 0.5; cursor: default; }
        .activity-card--soon:hover { background: #F7F6F2; }
      `}</style>

      {/* Hero */}
      <section style={{ padding: '5rem 2.5rem 3rem', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#888', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span style={{ display: 'block', width: '32px', height: '1px', background: '#ccc' }}/>
          made by students, for students
          <span style={{ display: 'block', width: '32px', height: '1px', background: '#ccc' }}/>
        </div>

        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#0f0f0f', marginBottom: '1.2rem' }}>
          Learn VLSI<br />
          the{' '}
          <span style={{ color: '#2563EB', fontFamily: 'IBM Plex Mono, monospace' }}>fun()</span>
          {' '}way
        </h1>

        <p style={{ fontSize: '1.05rem', color: '#666', lineHeight: 1.7, maxWidth: '540px', margin: '0 auto 2.5rem' }}>
          Interactive activities that teach semiconductor design, chip fabrication, and digital logic — no textbook required.
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#0f0f0f', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }}/>
          <span ref={countRef}>1,000,000,000,000</span> transistors made today
        </div>

        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
      </section>

      {/* Activities label */}
      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#aaa', padding: '0 2.5rem', maxWidth: '1100px', margin: '1rem auto 0' }}>
        — activities
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1px', background: 'rgba(0,0,0,0.08)', borderTop: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)', marginTop: '1rem' }}>
        {activities.map(a => (
          <button
            key={a.id}
            className={`activity-card${a.available ? '' : ' activity-card--soon'}`}
            disabled={!a.available}
            aria-disabled={!a.available}
            onClick={a.available ? () => navigate(`/playground/${a.id}`) : undefined}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '1.1rem' }}>
              {a.icon}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f0f0f', marginBottom: '0.45rem', lineHeight: 1.3 }}>{a.title}</div>
            <div style={{ fontSize: '0.82rem', color: '#777', lineHeight: 1.6 }}>{a.desc}</div>
            <div className={`card-tag ${a.available ? a.tagClass : 'tag-soon'}`} style={{ display: 'inline-block', marginTop: '1rem', fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '4px' }}>
              {a.available ? a.tag : 'Coming soon'}
            </div>
            {a.available && <div className="card-arrow">↗</div>}
          </button>
        ))}
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '3rem 2rem', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#bbb', letterSpacing: '0.06em' }}>
        <strong style={{ color: '#888' }}>SCDC</strong> — Semiconductor Chip Design Club · Summer VLSI Program 2026
      </footer>
    </div>
  )
}