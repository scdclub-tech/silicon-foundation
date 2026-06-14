import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Leaderboard() {
  const navigate = useNavigate()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('foundry_ceo_results')
        .select('*')
        .order('final_valuation', { ascending: false })
      setResults(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2' }}>
      <div style={{ padding: '1.5rem 2.5rem 0' }}>
        <button onClick={() => navigate('/challenges')} style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em' }}>
          ← back to hub
        </button>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 2rem 4rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>🏆</div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.2rem', fontWeight: 700, color: '#0f0f0f', marginBottom: '0.4rem' }}>
            Week 1 Leaderboard
          </h1>
          <p style={{ color: '#888', fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>
            Foundry CEO — ranked by company valuation
          </p>
        </div>

        {loading ? (
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
            {results.slice(0, 3).length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                {results.slice(0, 3).map((r, i) => (
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
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: i === 0 ? '#22c55e' : '#0f0f0f' }}>
                      ${(r.final_valuation / 1000000).toFixed(0)}M
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Rest of leaderboard */}
            {results.slice(3).map((r, i) => (
              <div key={r.id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', color: '#aaa', width: '24px' }}>
                    #{i + 4}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem', fontWeight: 600, color: '#0f0f0f' }}>{r.name}</div>
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#aaa' }}>{r.roll_number}</div>
                  </div>
                </div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '1rem', fontWeight: 700, color: '#16a34a' }}>
                  ${(r.final_valuation / 1000000).toFixed(0)}M
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {results.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '2rem' }}>
            {[
              { label: 'Total submissions', value: results.length },
              { label: 'Avg valuation', value: `$${(results.reduce((a, r) => a + r.final_valuation, 0) / results.length / 1000000).toFixed(0)}M` },
              { label: 'Top valuation', value: `$${(results[0].final_valuation / 1000000).toFixed(0)}M` },
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