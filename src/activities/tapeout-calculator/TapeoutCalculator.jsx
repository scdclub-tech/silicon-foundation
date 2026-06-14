import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NODES = [
  { label: '180nm', nre: 1_000_000, waferCost: 2_000, foundry: 'GlobalFoundries / TSMC' },
  { label: '90nm', nre: 3_000_000, waferCost: 4_000, foundry: 'TSMC / Samsung' },
  { label: '28nm', nre: 10_000_000, waferCost: 6_000, foundry: 'TSMC / GlobalFoundries' },
  { label: '16nm', nre: 50_000_000, waferCost: 8_000, foundry: 'TSMC / Samsung' },
  { label: '7nm', nre: 120_000_000, waferCost: 12_000, foundry: 'TSMC / Samsung' },
  { label: '5nm', nre: 200_000_000, waferCost: 17_000, foundry: 'TSMC / Samsung' },
  { label: '3nm', nre: 500_000_000, waferCost: 25_000, foundry: 'TSMC only' },
]

const WAFER_AREA = 70686 // mm² for 300mm wafer

function calcYield(defectDensity, dieArea) {
  return Math.pow(1 / (1 + defectDensity * dieArea / 1000), 2)
}

function fmt(n) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

export default function TapeoutCalculator() {
  const navigate = useNavigate()
  const [nodeIdx, setNodeIdx] = useState(2)
  const [dieSize, setDieSize] = useState(100)
  const [volume, setVolume] = useState(10000)

  const node = NODES[nodeIdx]
  const defectDensity = 0.1 + nodeIdx * 0.05
  const yld = calcYield(defectDensity, dieSize)
  const diesPerWafer = Math.floor((WAFER_AREA / dieSize) * 0.85)
  const goodDiesPerWafer = Math.floor(diesPerWafer * yld)
  const wafersNeeded = Math.ceil(volume / Math.max(goodDiesPerWafer, 1))
  const waferCost = wafersNeeded * node.waferCost
  const totalCost = node.nre + waferCost
  const perUnitCost = totalCost / volume
  const breakEven = Math.ceil(node.nre / (perUnitCost * 0.5))

  const statCard = (label, value, sub, color = '#0f0f0f') => (
    <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '1.2rem 1.5rem' }}>
      <div style={{ fontSize: '12px', color: '#aaa', fontFamily: 'Space Mono, monospace', marginBottom: '0.4rem' }}>{label}</div>
      <div style={{ fontSize: '1.6rem', fontWeight: 700, color, fontFamily: 'Space Mono, monospace', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: '#bbb', marginTop: '0.3rem' }}>{sub}</div>}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2' }}>
      <div style={{ padding: '1.5rem 2.5rem 0' }}>
        <button onClick={() => navigate('/')} style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em' }}>
          ← back to activities
        </button>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 2rem 4rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>💰</div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.2rem', fontWeight: 700, color: '#0f0f0f', marginBottom: '0.5rem' }}>Tape-out Cost Calculator</h1>
          <p style={{ color: '#888', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto' }}>
            Pick a process node, die size, and production volume. See exactly why chip design costs so much.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

          {/* LEFT — Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Node selector */}
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '1.5rem' }}>
              <div style={{ fontSize: '12px', fontFamily: 'Space Mono, monospace', color: '#aaa', marginBottom: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Process Node</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {NODES.map((n, i) => (
                  <button key={i} onClick={() => setNodeIdx(i)} style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: '1.5px solid',
                    borderColor: nodeIdx === i ? '#0f0f0f' : 'rgba(0,0,0,0.08)',
                    background: nodeIdx === i ? '#0f0f0f' : '#fff',
                    color: nodeIdx === i ? '#fff' : '#666',
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontWeight: nodeIdx === i ? 700 : 400,
                    transition: 'all 0.15s',
                  }}>
                    {n.label}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: '0.8rem', fontSize: '11px', color: '#bbb', fontFamily: 'Space Mono, monospace' }}>
                Foundry: {node.foundry}
              </div>
            </div>

            {/* Die size slider */}
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <div style={{ fontSize: '12px', fontFamily: 'Space Mono, monospace', color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Die Size</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '14px', fontWeight: 700, color: '#0f0f0f' }}>{dieSize} mm²</div>
              </div>
              <input type="range" min="10" max="800" step="10" value={dieSize} onChange={e => setDieSize(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#0f0f0f' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#ccc', fontFamily: 'Space Mono, monospace', marginTop: '4px' }}>
                <span>10mm² (tiny)</span><span>800mm² (massive)</span>
              </div>
              <div style={{ marginTop: '0.8rem', fontSize: '11px', color: '#bbb', fontFamily: 'Space Mono, monospace' }}>
                {dieSize < 50 ? 'Microcontroller size' : dieSize < 150 ? 'Mobile SoC size' : dieSize < 300 ? 'Desktop CPU size' : dieSize < 500 ? 'High-end GPU size' : 'Massive — very low yield'}
              </div>
            </div>

            {/* Volume slider */}
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <div style={{ fontSize: '12px', fontFamily: 'Space Mono, monospace', color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Production Volume</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '14px', fontWeight: 700, color: '#0f0f0f' }}>{volume.toLocaleString()} chips</div>
              </div>
              <input type="range" min="100" max="1000000" step="100" value={volume} onChange={e => setVolume(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#0f0f0f' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#ccc', fontFamily: 'Space Mono, monospace', marginTop: '4px' }}>
                <span>100</span><span>1,000,000</span>
              </div>
              <div style={{ marginTop: '0.8rem', fontSize: '11px', color: '#bbb', fontFamily: 'Space Mono, monospace' }}>
                {volume < 1000 ? 'Prototype run' : volume < 50000 ? 'Small batch' : volume < 200000 ? 'Medium production' : 'High volume manufacturing'}
              </div>
            </div>
          </div>

          {/* RIGHT — Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Big total */}
            <div style={{ background: '#0f0f0f', borderRadius: '14px', padding: '1.8rem', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontFamily: 'Space Mono, monospace', color: '#666', marginBottom: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Total cost</div>
              <div style={{ fontSize: '2.8rem', fontWeight: 700, color: '#fff', fontFamily: 'Space Mono, monospace', lineHeight: 1 }}>{fmt(totalCost)}</div>
              <div style={{ fontSize: '12px', color: '#555', marginTop: '0.5rem', fontFamily: 'Space Mono, monospace' }}>to manufacture {volume.toLocaleString()} chips</div>
            </div>

            {statCard('NRE Cost (one-time)', fmt(node.nre), 'masks, setup, engineering', '#dc2626')}
            {statCard('Wafer cost', fmt(waferCost), `${wafersNeeded} wafers × ${fmt(node.waferCost)} each`)}
            {statCard('Cost per chip', fmt(perUnitCost), `at ${volume.toLocaleString()} unit volume`, perUnitCost > 100 ? '#dc2626' : perUnitCost > 20 ? '#f59e0b' : '#16a34a')}
            {statCard('Yield', `${(yld * 100).toFixed(1)}%`, `~${goodDiesPerWafer} good dies per wafer`)}

            {/* Insight box */}
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '1.2rem 1.5rem' }}>
              <div style={{ fontSize: '11px', fontFamily: 'Space Mono, monospace', color: '#1e40af', marginBottom: '0.4rem', fontWeight: 700 }}>💡 insight</div>
              <div style={{ fontSize: '12px', color: '#1d4ed8', lineHeight: 1.6 }}>
                {perUnitCost > 1000
                  ? 'At this volume, NRE dominates. You need far more chips to amortize the fixed costs.'
                  : perUnitCost > 100
                  ? 'Still expensive per chip. Increase volume or shrink die size to reduce cost.'
                  : perUnitCost > 10
                  ? `You need ~${fmt(breakEven)} chips to break even if selling at 2× cost.`
                  : 'Good economics. High volume is making the NRE cost negligible per chip.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}