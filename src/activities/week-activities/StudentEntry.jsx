import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function StudentEntry({ onEnter }) {
  const [name, setName] = useState('')
  const [roll, setRoll] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!name.trim() || !roll.trim()) {
      setError('Please enter both your name and roll number.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data, error: err } = await supabase
        .from('students')
        .insert([{ name: name.trim(), roll_number: roll.trim() }])
        .select()
        .single()
      if (err) throw err
      onEnter({ id: data.id, name: data.name, roll_number: data.roll_number })
    } catch (e) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>🏆</div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: '#0f0f0f', marginBottom: '0.4rem' }}>
            SCDC Weekly Challenge
          </h1>
          <p style={{ color: '#888', fontSize: '0.9rem', fontFamily: 'Space Mono, monospace' }}>
            Semiconductor Chip Design Club
          </p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', padding: '2rem' }}>
          <div style={{ fontSize: '13px', fontFamily: 'Space Mono, monospace', color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            Enter your details to begin
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '12px', fontFamily: 'Space Mono, monospace', color: '#666', marginBottom: '6px', letterSpacing: '0.06em' }}>
              FULL NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Dushyant Sharma"
              style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '0.95rem', fontFamily: 'Space Grotesk, sans-serif', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: '8px', outline: 'none', background: '#fafafa', color: '#0f0f0f', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '12px', fontFamily: 'Space Mono, monospace', color: '#666', marginBottom: '6px', letterSpacing: '0.06em' }}>
              ROLL NUMBER
            </label>
            <input
              type="text"
              value={roll}
              onChange={e => setRoll(e.target.value)}
              placeholder="e.g. CS2024001"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '0.95rem', fontFamily: 'Space Grotesk, sans-serif', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: '8px', outline: 'none', background: '#fafafa', color: '#0f0f0f', boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '13px', color: '#DC2626', fontFamily: 'Space Mono, monospace' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.9rem', fontSize: '1rem', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', fontFamily: 'Space Grotesk, sans-serif', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Entering...' : 'Enter Challenge →'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#ccc' }}>
          your data is only used for club leaderboards
        </div>
      </div>
    </div>
  )
}