import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentEntry from './StudentEntry'
import { WEEK_CONFIG, getWeekStatus } from '../../lib/weekConfig'

export default function WeekHub() {
  const [student, setStudent] = useState(null)
  const navigate = useNavigate()

  if (!student) return <StudentEntry onEnter={setStudent} />

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 2rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#aaa', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
            welcome back
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 700, color: '#0f0f0f', marginBottom: '0.4rem' }}>
            Hey {student.name.split(' ')[0]} 👋
          </h1>
          <p style={{ color: '#888', fontSize: '0.9rem', fontFamily: 'Space Mono, monospace' }}>
            {student.roll_number} · SCDC Summer VLSI '26
          </p>
        </div>

        {/* Week cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.entries(WEEK_CONFIG).map(([weekNum, config]) => {
            const status = getWeekStatus(parseInt(weekNum))
            const isUnlocked = status === 'unlocked'
            const isExpired = status === 'expired'
            const isLocked = status === 'locked'

            const unlockDate = config.unlockDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })
            const deadlineDate = config.deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })

            return (
              <div key={weekNum} style={{
                background: '#fff',
                border: `1px solid ${isExpired ? '#FECACA' : isUnlocked ? '#BBF7D0' : 'rgba(0,0,0,0.08)'}`,
                borderRadius: '14px',
                padding: '1.5rem',
                opacity: isLocked ? 0.6 : 1,
                transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '2rem' }}>{config.emoji}</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#0f0f0f' }}>
                          Week {weekNum} — {config.title}
                        </div>
                        <div style={{
                          fontFamily: 'Space Mono, monospace',
                          fontSize: '10px',
                          padding: '2px 8px',
                          borderRadius: '99px',
                          background: isUnlocked ? '#F0FDF4' : isExpired ? '#FEF2F2' : '#F3F4F6',
                          color: isUnlocked ? '#16a34a' : isExpired ? '#dc2626' : '#9CA3AF',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                        }}>
                          {isUnlocked ? '✓ OPEN' : isExpired ? '✗ CLOSED' : '🔒 LOCKED'}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: '#888', lineHeight: 1.5, marginBottom: '4px' }}>
                        {config.description}
                      </div>

                      {isUnlocked && (
                        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#f59e0b', marginTop: '4px' }}>
                          ⏰ deadline: {deadlineDate}
                        </div>
                      )}
                      {isLocked && (
                        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#bbb', marginTop: '4px' }}>
                          unlocks {unlockDate}
                        </div>
                      )}
                      {isExpired && (
                        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#dc2626', marginTop: '4px' }}>
                          closed on {deadlineDate}
                        </div>
                      )}
                    </div>
                  </div>

                  {isUnlocked && (
                    <button
                      onClick={() => navigate(`/challenges/${config.activity}`, { state: { student } })}
                      style={{ background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.75rem 1.2rem', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap', flexShrink: 0 }}
                    >
                      Start →
                    </button>
                  )}

                  {isExpired && (
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#dc2626', flexShrink: 0, padding: '0.75rem 1.2rem', background: '#FEF2F2', borderRadius: '10px' }}>
                      Closed
                    </div>
                  )}

                  {isLocked && (
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#9CA3AF', flexShrink: 0, padding: '0.75rem 1.2rem', background: '#F3F4F6', borderRadius: '10px' }}>
                      🔒 Locked
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Leaderboard link */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => navigate('/challenges/leaderboard')}
            style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '0.75rem 2rem', fontSize: '13px', color: '#666', cursor: 'pointer', fontFamily: 'Space Mono, monospace' }}
          >
            🏆 view leaderboard
          </button>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '2rem', fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#ccc' }}>
          SCDC Summer VLSI '26 · one attempt per activity
        </div>
      </div>
    </div>
  )
}