import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const OBJECTS = [
  {
    id: 'ant',
    label: 'Ant',
    nm: 1_000_000,
    color: '#b45309',
    type: 'bio',
    shape: 'oval',
    fact: 'A reference point. One million nanometers — start here.',
  },
  {
    id: 'hair',
    label: 'Human Hair',
    nm: 70_000,
    color: '#d97706',
    type: 'bio',
    shape: 'circle',
    fact: 'A single strand of hair is about 70 micrometers wide — 35,000× wider than a modern transistor.',
  },
  {
    id: 'pollen',
    label: 'Pollen Grain',
    nm: 50_000,
    color: '#ca8a04',
    type: 'bio',
    shape: 'spiky',
    fact: 'Pollen grains range from 10–100 µm. Their spiky surface helps them stick to pollinators.',
  },
  {
    id: 'rbc',
    label: 'Red Blood Cell',
    nm: 8_000,
    color: '#dc2626',
    type: 'bio',
    shape: 'circle',
    fact: 'Your red blood cells are 8 µm across and carry oxygen through vessels just wide enough to squeeze through.',
  },
  {
    id: 'ecoli',
    label: 'E. coli Bacterium',
    nm: 2_000,
    color: '#16a34a',
    type: 'bio',
    shape: 'oval',
    fact: 'E. coli is ~2 µm long. Early 1970s transistors were roughly this size. We\'ve come a long way.',
  },
  {
    id: 'intel4004',
    label: 'Intel 4004 (1971)',
    nm: 10_000,
    color: '#64748b',
    type: 'chip',
    shape: 'rect',
    fact: 'First commercial microprocessor. 2,300 transistors. Changed the world.',
  },
  {
    id: 'intel286',
    label: 'Intel 286 (1982)',
    nm: 1_500,
    color: '#475569',
    type: 'chip',
    shape: 'rect',
    fact: 'IBM PC/AT era. 134,000 transistors on a chip.',
  },
  {
    id: 'coronavirus',
    label: 'Coronavirus',
    nm: 120,
    color: '#7c3aed',
    type: 'bio',
    shape: 'spiky',
    fact: 'The COVID-19 virus is ~120 nm across. The 90nm chip node (2004) was already smaller than this.',
  },
  {
    id: 'pentium',
    label: 'Pentium (1993)',
    nm: 800,
    color: '#3b82f6',
    type: 'chip',
    shape: 'rect',
    fact: '3.1 million transistors. The chip that brought computing home.',
  },
  {
    id: 'core2006',
    label: 'Intel Core (2006)',
    nm: 65,
    color: '#2563eb',
    type: 'chip',
    shape: 'rect',
    fact: '65nm — smaller than a flu virus. The era of "tick-tock" begins.',
  },
  {
    id: 'ribosome',
    label: 'Ribosome',
    nm: 25,
    color: '#ea580c',
    type: 'bio',
    shape: 'circle',
    fact: 'Ribosomes assemble proteins from amino acids. They\'re the nanomachines inside every living cell.',
  },
  {
    id: 'applea7',
    label: 'Apple A7 (2013)',
    nm: 28,
    color: '#0891b2',
    type: 'chip',
    shape: 'rect',
    fact: 'First 64-bit mobile chip. In your pocket.',
  },
  {
    id: 'tsmc7',
    label: 'TSMC 7nm (2018)',
    nm: 7,
    color: '#0284c7',
    type: 'chip',
    shape: 'rect',
    fact: '7nm — twice the density of DNA.',
  },
  {
    id: 'dna',
    label: 'DNA Double Helix',
    nm: 2.5,
    color: '#22c55e',
    type: 'bio',
    shape: 'helix',
    fact: 'The molecule of life is 2.5 nm wide. Modern transistors are now the same scale as your own genome.',
  },
  {
    id: 'applem1',
    label: 'Apple M1 (2020)',
    nm: 5,
    color: '#1d4ed8',
    type: 'chip',
    shape: 'rect',
    fact: '5nm. 16 billion transistors. Desktop performance in a laptop.',
  },
  {
    id: 'tsmc3',
    label: 'TSMC 3nm (2022)',
    nm: 3,
    color: '#4f46e5',
    type: 'chip',
    shape: 'rect',
    fact: '3nm. The width of 15 silicon atoms.',
  },
  {
    id: 'glucose',
    label: 'Glucose Molecule',
    nm: 0.9,
    color: '#3b82f6',
    type: 'bio',
    shape: 'cluster',
    fact: 'A glucose molecule is 0.9 nm. The sugar that fuels every cell — now larger than a transistor.',
  },
  {
    id: 'intel18a',
    label: 'Intel 18A / TSMC 2nm (2025)',
    nm: 2,
    color: '#6366f1',
    type: 'chip',
    shape: 'rect',
    fact: '2nm. The bleeding edge. You are here.',
    isLast: true,
  },
]

const SORTED = [...OBJECTS].sort((a, b) => b.nm - a.nm)
const MAX_NM = SORTED[0].nm
const MIN_NM = SORTED[SORTED.length - 1].nm

function nmToLog(nm) {
  return (Math.log10(nm) - Math.log10(MIN_NM)) / (Math.log10(MAX_NM) - Math.log10(MIN_NM))
}

function formatNm(nm) {
  if (nm >= 1_000_000) return `${(nm / 1_000_000).toLocaleString()} mm`
  if (nm >= 1_000) return `${(nm / 1_000).toLocaleString()} µm`
  return `${nm} nm`
}

function ObjectShape({ obj, visible }) {
  const logScale = nmToLog(obj.nm)
  const size = Math.max(40, Math.min(220, 40 + logScale * 180))
  const glow = obj.type === 'chip' ? `0 0 40px ${obj.color}66, 0 0 80px ${obj.color}22` : `0 0 60px ${obj.color}44`

  const baseStyle = {
    transition: 'opacity 0.8s ease, transform 0.8s ease',
    opacity: visible ? 1 : 0,
    transform: visible ? 'scale(1)' : 'scale(0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  }

  if (obj.shape === 'rect' || obj.type === 'chip') {
    const w = size * 1.4
    const h = size * 0.7
    return (
      <div style={baseStyle}>
        <div style={{
          width: w, height: h,
          background: `linear-gradient(135deg, ${obj.color}33, ${obj.color}11)`,
          border: `1px solid ${obj.color}99`,
          borderRadius: '4px',
          boxShadow: glow,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* circuit lines */}
          {[0.25, 0.5, 0.75].map(frac => (
            <div key={frac} style={{
              position: 'absolute',
              left: `${frac * 100}%`,
              top: 0, bottom: 0,
              width: '1px',
              background: `${obj.color}44`,
            }} />
          ))}
          {[0.33, 0.66].map(frac => (
            <div key={frac} style={{
              position: 'absolute',
              top: `${frac * 100}%`,
              left: 0, right: 0,
              height: '1px',
              background: `${obj.color}44`,
            }} />
          ))}
        </div>
      </div>
    )
  }

  if (obj.shape === 'spiky') {
    const spikes = obj.id === 'coronavirus' ? 16 : 12
    return (
      <div style={{ ...baseStyle, width: size + 40, height: size + 40 }}>
        <svg width={size + 40} height={size + 40} viewBox={`0 0 ${size + 40} ${size + 40}`}>
          <defs>
            <radialGradient id={`grad-${obj.id}`} cx="40%" cy="35%">
              <stop offset="0%" stopColor={obj.color} stopOpacity="0.5" />
              <stop offset="100%" stopColor={obj.color} stopOpacity="0.1" />
            </radialGradient>
          </defs>
          {Array.from({ length: spikes }).map((_, i) => {
            const angle = (i / spikes) * Math.PI * 2
            const r = size / 2
            const spikeLen = r * 0.3
            const x1 = (size / 2 + 20) + Math.cos(angle) * r
            const y1 = (size / 2 + 20) + Math.sin(angle) * r
            const x2 = (size / 2 + 20) + Math.cos(angle) * (r + spikeLen)
            const y2 = (size / 2 + 20) + Math.sin(angle) * (r + spikeLen)
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={obj.color} strokeWidth="2" strokeOpacity="0.7" />
          })}
          <circle cx={size / 2 + 20} cy={size / 2 + 20} r={size / 2}
            fill={`url(#grad-${obj.id})`} stroke={obj.color} strokeWidth="1.5" strokeOpacity="0.8" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: glow, pointerEvents: 'none' }} />
      </div>
    )
  }

  if (obj.shape === 'helix') {
    const h = size * 1.5
    return (
      <div style={{ ...baseStyle, width: size, height: h }}>
        <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`}>
          {Array.from({ length: 10 }).map((_, i) => {
            const y = (i / 9) * h
            const x1 = size * 0.2 + Math.sin(i * 0.7) * size * 0.2
            const x2 = size * 0.8 - Math.sin(i * 0.7) * size * 0.2
            return (
              <g key={i}>
                <line x1={x1} y1={y} x2={x2} y2={y} stroke={obj.color} strokeWidth="1.5" strokeOpacity="0.7" />
                <circle cx={x1} cy={y} r="3" fill={obj.color} fillOpacity="0.9" />
                <circle cx={x2} cy={y} r="3" fill={obj.color} fillOpacity="0.9" />
              </g>
            )
          })}
          <path d={`M ${size * 0.2} 0 ${Array.from({ length: 20 }, (_, i) => {
            const t = i / 19
            const y = t * h
            const x = size * 0.2 + Math.sin(t * Math.PI * 2.5) * size * 0.2
            return `L ${x} ${y}`
          }).join(' ')}`} fill="none" stroke={obj.color} strokeWidth="2" strokeOpacity="0.5" />
          <path d={`M ${size * 0.8} 0 ${Array.from({ length: 20 }, (_, i) => {
            const t = i / 19
            const y = t * h
            const x = size * 0.8 - Math.sin(t * Math.PI * 2.5) * size * 0.2
            return `L ${x} ${y}`
          }).join(' ')}`} fill="none" stroke={obj.color} strokeWidth="2" strokeOpacity="0.5" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, boxShadow: glow, pointerEvents: 'none', borderRadius: '50%' }} />
      </div>
    )
  }

  if (obj.shape === 'cluster') {
    return (
      <div style={{ ...baseStyle, width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size * 0.5} cy={size * 0.5} r={size * 0.18} fill={obj.color} fillOpacity="0.8" />
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const rad = (deg * Math.PI) / 180
            const cx = size * 0.5 + Math.cos(rad) * size * 0.28
            const cy = size * 0.5 + Math.sin(rad) * size * 0.28
            return (
              <g key={i}>
                <line x1={size * 0.5} y1={size * 0.5} x2={cx} y2={cy} stroke={obj.color} strokeWidth="1.5" strokeOpacity="0.5" />
                <circle cx={cx} cy={cy} r={size * 0.12} fill={obj.color} fillOpacity="0.7" />
              </g>
            )
          })}
        </svg>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: glow, pointerEvents: 'none' }} />
      </div>
    )
  }

  // oval
  if (obj.shape === 'oval') {
    return (
      <div style={baseStyle}>
        <div style={{
          width: size * 1.6,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 35% 35%, ${obj.color}55, ${obj.color}11)`,
          border: `1.5px solid ${obj.color}88`,
          boxShadow: glow,
        }} />
      </div>
    )
  }

  // default circle
  return (
    <div style={baseStyle}>
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, ${obj.color}55, ${obj.color}11)`,
        border: `1.5px solid ${obj.color}88`,
        boxShadow: glow,
      }} />
    </div>
  )
}

function ObjectCard({ obj, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const isEven = index % 2 === 0

  return (
    <div
      ref={ref}
      data-nm={obj.nm}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem 4rem calc(220px + 2rem)',
        position: 'relative',
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: isEven ? 'row' : 'row-reverse',
        alignItems: 'center',
        gap: '5rem',
        maxWidth: '900px',
        width: '100%',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(60px)',
      }}>
        <ObjectShape obj={obj} visible={visible} />

        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '13px',
            color: obj.color,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
            opacity: 0.9,
          }}>
            {formatNm(obj.nm)}
          </div>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '1rem',
            fontFamily: 'Space Grotesk, sans-serif',
            lineHeight: 1.1,
          }}>
            {obj.label}
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#888',
            lineHeight: 1.8,
            fontStyle: obj.type === 'chip' ? 'normal' : 'italic',
            fontFamily: 'Space Grotesk, sans-serif',
          }}>
            {obj.fact}
          </p>
          {obj.isLast && (
            <div style={{
              marginTop: '2rem',
              padding: '1rem 1.5rem',
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '8px',
              fontFamily: 'Space Mono, monospace',
              fontSize: '12px',
              color: '#6366f1',
              letterSpacing: '0.05em',
            }}>
              ▼ THE BOTTOM — 2nm is the physical frontier of silicon computing
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SizeOfTransistor() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [currentNm, setCurrentNm] = useState(MAX_NM)
  const [currentLabel, setCurrentLabel] = useState(SORTED[0].label)
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef(null)
  const hintRef = useRef(null)

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY
    const maxScroll = document.body.scrollHeight - window.innerHeight
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0
    setScrollProgress(progress)

    if (scrollY > 80 && !scrolled) setScrolled(true)

    // find which object is most centered in viewport
    const cards = document.querySelectorAll('[data-nm]')
    const viewportMid = scrollY + window.innerHeight / 2
    let closest = null
    let closestDist = Infinity
    cards.forEach(card => {
      const rect = card.getBoundingClientRect()
      const cardMid = scrollY + rect.top + rect.height / 2
      const dist = Math.abs(cardMid - viewportMid)
      if (dist < closestDist) {
        closestDist = dist
        closest = card
      }
    })
    if (closest) {
      const nm = parseFloat(closest.getAttribute('data-nm'))
      setCurrentNm(nm)
      // find label
      const obj = SORTED.find(o => o.nm === nm)
      if (obj) setCurrentLabel(obj.label)
    }
  }, [scrolled])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const bgDepth = Math.round(10 + scrollProgress * 4)
  const bgColor = `rgb(${bgDepth}, ${bgDepth}, ${Math.round(bgDepth * 1.5)})`

  const progressPercent = (1 - nmToLog(currentNm)) * 100

  return (
    <div ref={containerRef} style={{ background: bgColor, minHeight: '100vh', transition: 'background 0.5s ease' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital@0;1&family=Space+Grotesk:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        @keyframes bounceDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        @keyframes fadeOutHint {
          0% { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }
      `}</style>

      {/* Fixed header */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: '56px',
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        zIndex: 100,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '12px',
            color: '#666',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.06em',
            padding: '4px 0',
          }}
        >
          ← back
        </button>
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '11px',
          color: '#444',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          The Size of a Transistor
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#555', letterSpacing: '0.08em' }}>
            {currentLabel}
          </div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#4f9eff', letterSpacing: '0.06em' }}>
            {formatNm(currentNm)}
          </div>
        </div>
      </div>

      {/* Fixed left sidebar */}
      <div style={{
        position: 'fixed',
        left: 0, top: 0, bottom: 0,
        width: '220px',
        background: 'rgba(10,10,15,0.7)',
        backdropFilter: 'blur(8px)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        padding: '80px 1.5rem 2rem',
        zIndex: 90,
      }}>
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '9px',
          color: '#444',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}>
          Scale
        </div>

        {/* Scale bar */}
        <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
          <div style={{ position: 'relative', width: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', flex: '0 0 4px' }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0, right: 0,
              height: `${progressPercent}%`,
              background: 'linear-gradient(to bottom, #4f9eff, #6366f1)',
              borderRadius: '2px',
              transition: 'height 0.3s ease',
            }} />
            <div style={{
              position: 'absolute',
              top: `${progressPercent}%`,
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#6366f1',
              boxShadow: '0 0 12px #6366f1',
              transition: 'top 0.3s ease',
            }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#555' }}>1 mm</div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#555' }}>1 µm</div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#555' }}>100 nm</div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#555' }}>10 nm</div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#4f9eff' }}>2 nm</div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#555', letterSpacing: '0.08em', marginBottom: '6px' }}>
            CURRENT
          </div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '14px', color: '#4f9eff', fontWeight: 'bold' }}>
            {formatNm(currentNm)}
          </div>
        </div>
      </div>

      {/* Hero section */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: '220px',
        position: 'relative',
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '640px',
          padding: '2rem',
        }}>
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '11px',
            color: '#4f9eff',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>
            A journey through scale
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 700,
            color: '#fff',
            fontFamily: 'Space Grotesk, sans-serif',
            lineHeight: 1.05,
            marginBottom: '1.5rem',
          }}>
            The Size of a<br />
            <span style={{ color: '#4f9eff' }}>Transistor</span>
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            lineHeight: 1.8,
            fontFamily: 'Space Grotesk, sans-serif',
            marginBottom: '3rem',
          }}>
            From a strand of hair to a glucose molecule — scroll through 6 orders of magnitude and discover where transistors sit in the scale of reality.
          </p>
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '12px',
            color: '#4f9eff',
            letterSpacing: '0.1em',
            animation: `bounceDown 1.5s ease-in-out infinite`,
            opacity: scrolled ? 0 : 1,
            transition: 'opacity 0.6s ease',
          }}>
            ↓ scroll to zoom in
          </div>
        </div>
      </div>

      {/* Object cards */}
      {SORTED.map((obj, i) => (
        <ObjectCard key={obj.id} obj={obj} index={i} />
      ))}

      {/* End cap */}
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: '220px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}>
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '11px',
            color: '#444',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            You've reached the bottom
          </div>
          <p style={{
            fontSize: '1rem',
            color: '#666',
            lineHeight: 1.8,
            fontFamily: 'Space Grotesk, sans-serif',
          }}>
            At 2nm, we're building transistors from just a handful of silicon atoms. The physics of classical semiconductors is running out. What comes next is quantum.
          </p>
        </div>
      </div>
    </div>
  )
}
