import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

const activities = [
  { id: 'binary-blitz', icon: '⚡', title: 'Binary Blitz', desc: 'Binary flashes on screen. Convert to decimal before the timer runs out. Gets brutal fast.', tag: 'Game', tagClass: 'tag-game', bg: '#FFF1F2' },
  { id: 'tapeout-calculator', icon: '💰', title: 'Tape-out Cost Calculator', desc: 'Pick a node, set die size, choose volume. Watch NRE and per-unit cost update live.', tag: 'Tool', tagClass: 'tag-tool', bg: '#F0FDF4' },
  { id: 'wafer-defect-map', icon: '🎲', title: 'Wafer Defect Map', desc: 'Sprinkle defects across a silicon wafer and watch yield drop in real time.', tag: 'Simulation', tagClass: 'tag-sim', bg: '#FFF7ED' },
  { id: 'size-of-transistor', icon: '🔬', title: 'The Size of a Transistor', desc: 'Scroll from a human hair down to a 2nm transistor. Feel the scale that makes modern chips extraordinary.', tag: 'Visualization', tagClass: 'tag-viz', bg: '#F0FDFA' },
  { id: 'moores-law', icon: '📈', title: "Moore's Law Timeline", desc: "From Intel's 4004 to Apple's M-series — an animated journey through 50 years of exponential growth.", tag: 'Visualization', tagClass: 'tag-viz', bg: '#EEF2FF' },
  { id: 'verification-puzzle', icon: '🧩', title: 'The Verification Puzzle', desc: 'Probe a black-box chip. Set inputs, observe outputs, figure out what is hiding inside.', tag: 'Game', tagClass: 'tag-game', bg: '#FFFBEB' },
  { id: 'logic-gate-sandbox', icon: '🔧', title: 'Logic Gate Sandbox', desc: 'Drag, drop, and wire logic gates together. Watch truth tables update live.', tag: 'Tool', tagClass: 'tag-tool', bg: '#FAF5FF' },
  { id: 'build-your-fab', icon: '🏭', title: 'Build Your Own Fab', desc: 'Run a chip fabrication plant. Buy equipment, manage yield, survive random events.', tag: 'Simulation', tagClass: 'tag-sim', bg: '#EFF6FF' },
  { id: 'journey-through-chip', icon: '🌀', title: 'Journey Through a Chip', desc: 'Zoom from a full 300mm wafer into a single atom-thin gate oxide. Like Google Maps for silicon.', tag: 'Visualization', tagClass: 'tag-viz', bg: '#FDF2F8' },
  { id: 'hot-takes', icon: '🤔', title: 'Hot Takes: VLSI Edition', desc: 'Spicy statements about chip design. Agree or disagree. See how your batch splits.', tag: 'Discussion', tagClass: 'tag-quiz', bg: '#F9FAFB' },
]

export default function Home() {
  const navigate = useNavigate()
  const countRef = useRef(null)

  useEffect(() => {
    const base = 1e12
    const rate = 1500000
    const start = Date.now()
    const interval = setInterval(() => {
      const count = base + ((Date.now() - start) * rate) / 1000
      if (countRef.current) {
        countRef.current.textContent = Math.floor(count).toLocaleString('en-IN')
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
      `}</style>

      {/* Hero */}
      <section style={{ padding: '5rem 2.5rem 3rem', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#888', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span style={{ display: 'block', width: '32px', height: '1px', background: '#ccc' }}/>
          made by students, for students
          <span style={{ display: 'block', width: '32px', height: '1px', background: '#ccc' }}/>
        </div>

        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#0f0f0f', marginBottom: '1.2rem' }}>
          Learn VLSI<br />
          the{' '}
          <span style={{ color: '#2563EB', fontFamily: 'Space Mono, monospace' }}>fun()</span>
          {' '}way
        </h1>

        <p style={{ fontSize: '1.05rem', color: '#666', lineHeight: 1.7, maxWidth: '540px', margin: '0 auto 2.5rem' }}>
          Ten interactive activities that teach semiconductor design, chip fabrication, and digital logic — no textbook required.
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#0f0f0f', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontFamily: 'Space Mono, monospace', fontSize: '13px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }}/>
          <span ref={countRef}>1,000,000,000,000</span> transistors made today
        </div>

        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
      </section>

      {/* Activities label */}
      <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#aaa', padding: '0 2.5rem', maxWidth: '1100px', margin: '1rem auto 0' }}>
        — activities
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1px', background: 'rgba(0,0,0,0.08)', borderTop: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)', marginTop: '1rem' }}>
        {activities.map(a => (
          <button key={a.id} className="activity-card" onClick={() => navigate(`/${a.id}`)}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '1.1rem' }}>
              {a.icon}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f0f0f', marginBottom: '0.45rem', lineHeight: 1.3 }}>{a.title}</div>
            <div style={{ fontSize: '0.82rem', color: '#777', lineHeight: 1.6 }}>{a.desc}</div>
            <div className={`card-tag ${a.tagClass}`} style={{ display: 'inline-block', marginTop: '1rem', fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '4px' }}>
              {a.tag}
            </div>
            <div className="card-arrow">↗</div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '3rem 2rem', fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#bbb', letterSpacing: '0.06em' }}>
        <strong style={{ color: '#888' }}>SCDC</strong> — Semiconductor Chip Design Club · Summer VLSI Program 2026
      </footer>
    </div>
  )
}