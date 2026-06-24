import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const TABS = [
  {
    id: 'foundry',
    week: 1,
    label: 'Week 1',
    title: 'Foundry CEO',
    subtitle: 'Ranked by company valuation',
    emoji: '🏭',
    table: 'foundry_ceo_results',
    orderBy: 'final_valuation',
    scoreKey: 'final_valuation',
    formatScore: v => `$${(v / 1000000).toFixed(0)}M`,
    statsLabel: 'valuation',
    avgFn: rows => `$${(rows.reduce((a, r) => a + r.final_valuation, 0) / rows.length / 1000000).toFixed(0)}M`,
    topFn: rows => `$${(rows[0].final_valuation / 1000000).toFixed(0)}M`,
    scoreColor: '#16a34a',
  },
  {
    id: 'tapeout',
    week: 2,
    label: 'Week 2',
    title: 'Tapeout Sprint',
    subtitle: 'Ranked by total score',
    emoji: '⚙️',
    table: 'tapeout_sprint_results',
    orderBy: 'total_score',
    scoreKey: 'total_score',
    formatScore: v => `${v != null ? Number(v).toFixed(1) : '—'}/10`,
    statsLabel: 'score',
    avgFn: rows => `${(rows.reduce((a, r) => a + (r.total_score || 0), 0) / rows.length).toFixed(1)}/10`,
    topFn: rows => `${Number(rows[0].total_score).toFixed(1)}/10`,
    scoreColor: '#2563eb',
  },
  {
    id: 'detective',
    week: 3,
    label: 'Week 3',
    title: 'Silicon Detective',
    subtitle: 'Ranked by total score',
    emoji: '🔍',
    table: 'silicon_detective_results',
    orderBy: 'total_score',
    scoreKey: 'total_score',
    formatScore: v => `${v != null ? Number(v).toFixed(0) : '—'}/100`,
    statsLabel: 'score',
    avgFn: rows => `${(rows.reduce((a, r) => a + (r.total_score || 0), 0) / rows.length).toFixed(0)}/100`,
    topFn: rows => `${Number(rows[0].total_score).toFixed(0)}/100`,
    scoreColor: '#7c3aed',
  },
]

const medals = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const navigate = useNavigate()
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
  const results = data[tab.id]
  const isLoading = loading[tab.id]

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2' }}>
      <div style={{ padding: '1.5rem 2.5rem 0' }}>
        <button onClick={() => navigate('/challenges')} style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em' }}>
          ← back to hub
        </button>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 2rem 4rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>🏆</div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.2rem', fontWeight: 700, color: '#0f0f0f', marginBottom: '0.4rem' }}>
            Leaderboard
          </h1>
          <p style={{ color: '#888', fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>
            Weekly challenge rankings
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '0.4rem' }}>
          {TABS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(i)}
              style={{
                flex: 1,
                fontFamily: 'Space Mono, monospace',
                fontSize: '12px',
                padding: '0.55rem 0.75rem',
                background: activeTab === i ? '#0f0f0f' : 'none',
                border: 'none',
                borderRadius: '8px',
                color: activeTab === i ? '#fff' : '#888',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                transition: 'all 0.15s',
                fontWeight: activeTab === i ? 700 : 400,
              }}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        {/* Week subtitle */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#0f0f0f' }}>{tab.title}</div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#aaa', marginTop: '0.25rem' }}>{tab.subtitle}</div>
        </div>

        {isLoading || results === null ? (
          <div style={{ textAlign: 'center', fontFamily: 'Space Mono, monospace', color: '#aaa', padding: '3rem' }}>
            Loading results...
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '3rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👀</div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', color: '#aaa' }}>
              No submissions yet — be the first!
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

            {/* Top 3 podium */}
            {results.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                {results.slice(0, Math.min(3, results.length)).map((r, i) => (
                  <div key={r.id} style={{
                    background: i === 0 ? '#0f0f0f' : '#fff',
                    border: `1px solid ${i === 0 ? '#0f0f0f' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: '14px',
                    padding: '1.5rem 1rem',
                    textAlign: 'center',
                    order: i === 0 ? 2 : i === 1 ? 1 : 3,
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{medals[i]}</div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem', fontWeight: 700, color: i === 0 ? '#fff' : '#0f0f0f', marginBottom: '0.3rem' }}>
                      {r.name.split(' ')[0]}
                    </div>
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: i === 0 ? '#555' : '#aaa', marginBottom: '0.5rem' }}>
                      {r.roll_number}
                    </div>
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: i === 0 ? '#22c55e' : tab.scoreColor }}>
                      {tab.formatScore(r[tab.scoreKey])}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Rest of leaderboard */}
            {results.slice(3).map((r, i) => (
              <div key={r.id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', color: '#aaa', width: '28px' }}>
                    #{i + 4}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem', fontWeight: 600, color: '#0f0f0f' }}>{r.name}</div>
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#aaa' }}>{r.roll_number}</div>
                  </div>
                </div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '1rem', fontWeight: 700, color: tab.scoreColor }}>
                  {tab.formatScore(r[tab.scoreKey])}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {results !== null && results.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '2.5rem' }}>
            {[
              { label: 'Submissions', value: results.length },
              { label: `Avg ${tab.statsLabel}`, value: tab.avgFn(results) },
              { label: `Top ${tab.statsLabel}`, value: tab.topFn(results) },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#aaa', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '1.2rem', fontWeight: 700, color: '#0f0f0f' }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
