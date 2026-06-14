import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
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

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#fff', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>instructor view</div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 700 }}>Week 1 — Foundry CEO Results</h1>
          <p style={{ color: '#555', fontFamily: 'Space Mono, monospace', fontSize: '12px', marginTop: '0.4rem' }}>{results.length} submissions so far</p>
        </div>

        {loading ? (
          <div style={{ fontFamily: 'Space Mono, monospace', color: '#555' }}>Loading...</div>
        ) : results.length === 0 ? (
          <div style={{ fontFamily: 'Space Mono, monospace', color: '#555' }}>No submissions yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222' }}>
                {['Rank', 'Name', 'Roll No.', 'Final Valuation', 'Time Taken', 'Submitted'].map(h => (
                  <th key={h} style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#555', textAlign: 'left', padding: '0.75rem 1rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #1a1a1a' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#161616'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '1rem', fontFamily: 'Space Mono, monospace', fontSize: '13px', color: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : i === 2 ? '#b45309' : '#555' }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', color: '#fff', fontWeight: 600 }}>{r.name}</td>
                  <td style={{ padding: '1rem', fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#666' }}>{r.roll_number}</td>
                  <td style={{ padding: '1rem', fontFamily: 'Space Mono, monospace', fontSize: '14px', color: '#22c55e', fontWeight: 700 }}>
                    ${(r.final_valuation / 1000000).toFixed(0)}M
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