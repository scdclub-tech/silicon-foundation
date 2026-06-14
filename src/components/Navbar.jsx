import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.2rem 2.5rem',
      background: '#F7F6F2',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="8" y="8" width="16" height="16" rx="2" fill="#0f0f0f"/>
          <rect x="11" y="11" width="10" height="10" rx="1" fill="#F7F6F2"/>
          <rect x="13" y="13" width="2" height="2" fill="#2563EB"/>
          <rect x="17" y="13" width="2" height="2" fill="#2563EB"/>
          <rect x="13" y="17" width="2" height="2" fill="#2563EB"/>
          <rect x="17" y="17" width="2" height="2" fill="#2563EB"/>
          <rect x="5" y="11" width="3" height="1.5" rx="0.5" fill="#0f0f0f"/>
          <rect x="5" y="14" width="3" height="1.5" rx="0.5" fill="#0f0f0f"/>
          <rect x="5" y="17" width="3" height="1.5" rx="0.5" fill="#0f0f0f"/>
          <rect x="24" y="11" width="3" height="1.5" rx="0.5" fill="#0f0f0f"/>
          <rect x="24" y="14" width="3" height="1.5" rx="0.5" fill="#0f0f0f"/>
          <rect x="24" y="17" width="3" height="1.5" rx="0.5" fill="#0f0f0f"/>
          <rect x="11" y="5" width="1.5" height="3" rx="0.5" fill="#0f0f0f"/>
          <rect x="14" y="5" width="1.5" height="3" rx="0.5" fill="#0f0f0f"/>
          <rect x="17" y="5" width="1.5" height="3" rx="0.5" fill="#0f0f0f"/>
          <rect x="11" y="24" width="1.5" height="3" rx="0.5" fill="#0f0f0f"/>
          <rect x="14" y="24" width="1.5" height="3" rx="0.5" fill="#0f0f0f"/>
          <rect x="17" y="24" width="1.5" height="3" rx="0.5" fill="#0f0f0f"/>
        </svg>
        <div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#1a1a1a' }}>SCDC</div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#888', letterSpacing: '0.08em' }}>Semiconductor Chip Design Club</div>
        </div>
      </Link>
      <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#888', border: '1px solid rgba(0,0,0,0.12)', padding: '4px 12px', borderRadius: '20px' }}>
        Summer VLSI '26
      </div>
    </nav>
  )
}