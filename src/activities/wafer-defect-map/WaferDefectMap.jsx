import { useRef, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const WAFER_R = 200
const EDGE_EXCLUSION = 15
const CENTER = 220

export default function WaferDefectMap() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [dieSize, setDieSize] = useState(10)
  const [defects, setDefects] = useState([])
  const [stats, setStats] = useState({ total: 0, good: 0, bad: 0, yield: 100 })
  const [isPlacing, setIsPlacing] = useState(false)

  const mmToPx = dieSize * 1.5

  const computeStats = useCallback((defectList, diePx) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dies = []
    const step = diePx
    for (let x = CENTER - WAFER_R + EDGE_EXCLUSION; x < CENTER + WAFER_R - EDGE_EXCLUSION; x += step) {
      for (let y = CENTER - WAFER_R + EDGE_EXCLUSION; y < CENTER + WAFER_R - EDGE_EXCLUSION; y += step) {
        const cx = x + step / 2
        const cy = y + step / 2
        const dist = Math.sqrt((cx - CENTER) ** 2 + (cy - CENTER) ** 2)
        if (dist < WAFER_R - EDGE_EXCLUSION) {
          const hit = defectList.some(d => d.x >= x && d.x < x + step && d.y >= y && d.y < y + step)
          dies.push({ x, y, good: !hit })
        }
      }
    }
    const good = dies.filter(d => d.good).length
    const total = dies.length
    setStats({ total, good, bad: total - good, yield: total ? ((good / total) * 100).toFixed(1) : 100 })
    return dies
  }, [])

  const draw = useCallback((defectList) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const diePx = mmToPx
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Wafer background
    ctx.beginPath()
    ctx.arc(CENTER, CENTER, WAFER_R, 0, Math.PI * 2)
    ctx.fillStyle = '#e8e0d0'
    ctx.fill()
    ctx.strokeStyle = '#c4b89a'
    ctx.lineWidth = 2
    ctx.stroke()

    // Edge exclusion ring
    ctx.beginPath()
    ctx.arc(CENTER, CENTER, WAFER_R - EDGE_EXCLUSION, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.stroke()
    ctx.setLineDash([])

    // Dies
    const dies = []
    const step = diePx
    for (let x = CENTER - WAFER_R + EDGE_EXCLUSION; x < CENTER + WAFER_R - EDGE_EXCLUSION; x += step) {
      for (let y = CENTER - WAFER_R + EDGE_EXCLUSION; y < CENTER + WAFER_R - EDGE_EXCLUSION; y += step) {
        const cx = x + step / 2
        const cy = y + step / 2
        const dist = Math.sqrt((cx - CENTER) ** 2 + (cy - CENTER) ** 2)
        if (dist < WAFER_R - EDGE_EXCLUSION) {
          const hit = defectList.some(d => d.x >= x && d.x < x + step && d.y >= y && d.y < y + step)
          dies.push({ x, y, good: !hit })
          ctx.fillStyle = hit ? 'rgba(220,38,38,0.75)' : 'rgba(37,99,235,0.18)'
          ctx.strokeStyle = hit ? 'rgba(185,28,28,0.8)' : 'rgba(37,99,235,0.35)'
          ctx.lineWidth = 0.5
          ctx.fillRect(x, y, step - 1, step - 1)
          ctx.strokeRect(x, y, step - 1, step - 1)
        }
      }
    }

    // Flat (notch)
    ctx.beginPath()
    ctx.arc(CENTER, CENTER + WAFER_R - 5, 8, 0, Math.PI * 2)
    ctx.fillStyle = '#F7F6F2'
    ctx.fill()

    // Defect dots
    defectList.forEach(d => {
      ctx.beginPath()
      ctx.arc(d.x, d.y, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#7f1d1d'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(d.x, d.y, 2, 0, Math.PI * 2)
      ctx.fillStyle = '#fca5a5'
      ctx.fill()
    })

    const good = dies.filter(d => d.good).length
    const total = dies.length
    setStats({ total, good, bad: total - good, yield: total ? ((good / total) * 100).toFixed(1) : 100 })
  }, [mmToPx])

  useEffect(() => { draw(defects) }, [defects, dieSize, draw])

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }

  const addDefect = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const { x, y } = getPos(e, canvas)
    const dist = Math.sqrt((x - CENTER) ** 2 + (y - CENTER) ** 2)
    if (dist < WAFER_R - EDGE_EXCLUSION) {
      setDefects(prev => [...prev, { x, y, id: Date.now() + Math.random() }])
    }
  }, [])

  const handleMouseDown = (e) => { setIsPlacing(true); addDefect(e) }
  const handleMouseMove = (e) => { if (isPlacing) addDefect(e) }
  const handleMouseUp = () => setIsPlacing(false)

  const addRandom = () => {
    const newDefects = []
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = Math.random() * (WAFER_R - EDGE_EXCLUSION - 10)
      newDefects.push({ x: CENTER + r * Math.cos(angle), y: CENTER + r * Math.sin(angle), id: Date.now() + i })
    }
    setDefects(prev => [...prev, ...newDefects])
  }

  const yieldNum = parseFloat(stats.yield)
  const yieldColor = yieldNum > 80 ? '#16a34a' : yieldNum > 50 ? '#f59e0b' : '#dc2626'

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2' }}>
      <div style={{ padding: '1.5rem 2.5rem 0' }}>
        <button onClick={() => navigate('/')} style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em' }}>
          ← back to activities
        </button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 2rem 4rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>🎲</div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.2rem', fontWeight: 700, color: '#0f0f0f', marginBottom: '0.5rem' }}>Wafer Defect Map</h1>
          <p style={{ color: '#888', fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto' }}>
            Click or drag on the wafer to place defects. Watch yield drop in real time. Resize dies to see how area affects economics.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2.5rem', alignItems: 'start' }}>

          {/* Controls + Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            {/* Yield — big number */}
            <div style={{ background: '#0f0f0f', borderRadius: '14px', padding: '1.8rem', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontFamily: 'Space Mono, monospace', color: '#666', marginBottom: '0.4rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Wafer Yield</div>
              <div style={{ fontSize: '3.5rem', fontWeight: 700, fontFamily: 'Space Mono, monospace', color: yieldColor, lineHeight: 1 }}>{stats.yield}%</div>
              <div style={{ fontSize: '12px', color: '#555', marginTop: '0.4rem', fontFamily: 'Space Mono, monospace' }}>
                {stats.good} good / {stats.total} total dies
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              {[
                { label: 'Good dies', value: stats.good, color: '#16a34a' },
                { label: 'Failed dies', value: stats.bad, color: '#dc2626' },
                { label: 'Defects placed', value: defects.length, color: '#2563EB' },
                { label: 'Dies per wafer', value: stats.total, color: '#0f0f0f' },
              ].map((s, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontSize: '11px', color: '#aaa', fontFamily: 'Space Mono, monospace', marginBottom: '0.3rem' }}>{s.label}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'Space Mono, monospace', color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Die size */}
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '1.2rem 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div style={{ fontSize: '12px', fontFamily: 'Space Mono, monospace', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Die Size</div>
                <div style={{ fontSize: '13px', fontFamily: 'Space Mono, monospace', fontWeight: 700, color: '#0f0f0f' }}>{dieSize}mm</div>
              </div>
              <input type="range" min="5" max="30" step="1" value={dieSize}
                onChange={e => { setDieSize(Number(e.target.value)); setDefects([]) }}
                style={{ width: '100%', accentColor: '#0f0f0f' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#ccc', fontFamily: 'Space Mono, monospace', marginTop: '4px' }}>
                <span>5mm (tiny)</span><span>30mm (huge)</span>
              </div>
              <div style={{ marginTop: '0.6rem', fontSize: '11px', color: '#aaa', fontFamily: 'Space Mono, monospace' }}>
                Changing die size resets defects
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={addRandom} style={{ flex: 1, background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.85rem', fontSize: '13px', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
                + scatter 20 defects
              </button>
              <button onClick={() => setDefects([])} style={{ flex: 1, background: '#fff', color: '#0f0f0f', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '10px', padding: '0.85rem', fontSize: '13px', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
                clear all
              </button>
            </div>

            {/* Insight */}
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '1.2rem 1.5rem' }}>
              <div style={{ fontSize: '11px', fontFamily: 'Space Mono, monospace', color: '#1e40af', fontWeight: 700, marginBottom: '0.4rem' }}>💡 insight</div>
              <div style={{ fontSize: '12px', color: '#1d4ed8', lineHeight: 1.6 }}>
                {yieldNum === 100
                  ? 'No defects yet. Click the wafer or scatter some defects to see yield drop.'
                  : yieldNum > 90
                  ? 'Excellent yield! This wafer is very clean — great for high-volume production.'
                  : yieldNum > 70
                  ? 'Decent yield. Real fabs target 90%+ for profitability.'
                  : yieldNum > 40
                  ? 'Yield is suffering. A defect cluster like this would cost millions in production.'
                  : 'Critical yield loss. This wafer would likely be scrapped entirely.'}
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div>
            <canvas
              ref={canvasRef}
              width={440}
              height={440}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: 'crosshair', borderRadius: '12px', display: 'block', maxWidth: '100%', userSelect: 'none' }}
            />
            <div style={{ textAlign: 'center', marginTop: '0.8rem', fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#ccc', letterSpacing: '0.06em' }}>
              click or drag to place defects
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}