import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const TABS = [
  { id: 'foundry', label: 'Week 1 — Foundry CEO', table: 'foundry_ceo_results', orderBy: 'final_valuation', scoreKey: 'final_valuation' },
  { id: 'tapeout', label: 'Week 2 — Tapeout Sprint', table: 'tapeout_sprint_results', orderBy: 'total_score', scoreKey: 'total_score' },
  { id: 'detective', label: 'Week 3 — Silicon Detective', table: 'silicon_detective_results', orderBy: 'total_score', scoreKey: 'total_score' },
]

function formatScore(tab, value) {
  if (tab.id === 'foundry') return `$${(value / 1000000).toFixed(0)}M`
  return value?.toFixed ? value.toFixed(1) : value
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0)
  const [data, setData] = useState({ foundry: null, tapeout: null, detective: null })
  const [loading, setLoading] = useState({ foundry: false, tapeout: false, detective: false })

  useEffect(() => {
    const tab = TABS[activeTab]
    if (data[tab.id] !== null) return
    setLoading(l => ({ ...l, [tab.id]: true }))
    supabase
      .from(tab.table)
      .select('*')
      .order(tab.orderBy, { ascending: false })
      .then(({ data: rows }) => {
        setData(d => ({ ...d, [tab.id]: rows || [] }))
        setLoading(l => ({ ...l, [tab.id]: false }))
      })
  }, [activeTab])

  const tab = TABS[activeTab]
  const rows = data[tab.id]
  const isLoading = loading[tab.id]

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#fff', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>instructor view</div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 700 }}>Challenge Results</h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '2rem', borderBottom: '1px solid #222' }}>
          {TABS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(i)}
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '12px',
                padding: '0.6rem 1.2rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === i ? '2px solid #22c55e' : '2px solid transparent',
                color: activeTab === i ? '#22c55e' : '#555',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                marginBottom: '-1px',
                transition: 'color 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {rows !== null && (
          <p style={{ color: '#555', fontFamily: 'Space Mono, monospace', fontSize: '12px', marginBottom: '1.5rem', marginTop: '-1rem' }}>
            {rows.length} submission{rows.length !== 1 ? 's' : ''}
          </p>
        )}

        {isLoading || rows === null ? (
          <div style={{ fontFamily: 'Space Mono, monospace', color: '#555' }}>Loading...</div>
        ) : rows.length === 0 ? (
          <div style={{ fontFamily: 'Space Mono, monospace', color: '#555' }}>No submissions yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222' }}>
                {['Rank', 'Name', 'Roll No.', 'Score', 'Time Taken', 'Submitted'].map(h => (
                  <th key={h} style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#555', textAlign: 'left', padding: '0.75rem 1rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.id}
                  style={{ borderBottom: '1px solid #1a1a1a' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#161616'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '1rem', fontFamily: 'Space Mono, monospace', fontSize: '13px', color: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : i === 2 ? '#b45309' : '#555' }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', color: '#fff', fontWeight: 600 }}>{r.name}</td>
                  <td style={{ padding: '1rem', fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#666' }}>{r.roll_number}</td>
                  <td style={{ padding: '1rem', fontFamily: 'Space Mono, monospace', fontSize: '14px', color: '#22c55e', fontWeight: 700 }}>
                    {formatScore(tab, r[tab.scoreKey])}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#666' }}>{r.time_taken}s</td>
                  <td style={{ padding: '1rem', fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#444' }}>
                    {new Date(r.created_at).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
