import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { colors, fonts } from '../theme'

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/domains', label: 'Domains' },
  { to: '/programs', label: 'Programs' },
  { to: '/events', label: 'Events' },
  { to: '/team', label: 'Team' },
  { to: '/playground', label: 'Playground' },
]

function ChipLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="16" height="16" rx="2" fill={colors.ink} />
      <rect x="11" y="11" width="10" height="10" rx="1" fill={colors.cream} />
      <rect x="13" y="13" width="2" height="2" fill={colors.accent} />
      <rect x="17" y="13" width="2" height="2" fill={colors.accent} />
      <rect x="13" y="17" width="2" height="2" fill={colors.accent} />
      <rect x="17" y="17" width="2" height="2" fill={colors.accent} />
      {[11, 14, 17].map((v) => (
        <g key={v}>
          <rect x="5" y={v} width="3" height="1.5" rx="0.5" fill={colors.ink} />
          <rect x="24" y={v} width="3" height="1.5" rx="0.5" fill={colors.ink} />
          <rect x={v} y="5" width="1.5" height="3" rx="0.5" fill={colors.ink} />
          <rect x={v} y="24" width="1.5" height="3" rx="0.5" fill={colors.ink} />
        </g>
      ))}
    </svg>
  )
}

function JoinButton({ block = false, onNavigate }) {
  return (
    <Link
      to="/join"
      onClick={onNavigate}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-[13px] font-semibold no-underline transition-opacity hover:opacity-85 ${
        block ? 'w-full' : ''
      }`}
      style={{ background: colors.ink, color: colors.cream, fontFamily: fonts.display }}
    >
      Join us
      <span aria-hidden="true">→</span>
    </Link>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const linkClass = ({ isActive }) =>
    `text-[13px] no-underline transition-colors ${
      isActive ? 'underline decoration-1 underline-offset-[6px]' : 'hover:opacity-70'
    }`

  const linkStyle = ({ isActive }) => ({
    fontFamily: fonts.display,
    color: isActive ? colors.ink : colors.muted,
    fontWeight: isActive ? 600 : 500,
  })

  return (
    <nav
      className="sticky top-0 z-[100]"
      style={{ background: colors.cream, borderBottom: `1px solid ${colors.line}` }}
    >
      <div className="flex items-center justify-between gap-6 px-6 py-4 md:px-10">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <ChipLogo />
          <span className="flex flex-col leading-tight">
            <span
              className="text-[13px] font-bold uppercase tracking-[0.04em]"
              style={{ fontFamily: fonts.mono, color: colors.ink }}
            >
              SCDC
            </span>
            <span
              className="hidden text-[10px] tracking-[0.08em] sm:block"
              style={{ fontFamily: fonts.mono, color: colors.muted }}
            >
              Semiconductor Chip Design Club
            </span>
          </span>
        </Link>

        {/* Desktop nav — 768px and up */}
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} style={linkStyle}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:block">
          <JoinButton />
        </div>

        {/* Hamburger — below 768px */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] border-none bg-transparent p-0 md:hidden"
        >
          <span
            className="block h-[1.5px] w-5 transition-transform"
            style={{
              background: colors.ink,
              transform: open ? 'translateY(3.25px) rotate(45deg)' : 'none',
            }}
          />
          <span
            className="block h-[1.5px] w-5 transition-transform"
            style={{
              background: colors.ink,
              transform: open ? 'translateY(-3.25px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="flex flex-col gap-4 px-6 pb-6 pt-2 md:hidden"
          style={{ borderTop: `1px solid ${colors.line}` }}
        >
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={close} className={linkClass} style={linkStyle}>
              {l.label}
            </NavLink>
          ))}
          <JoinButton block onNavigate={close} />
        </div>
      )}
    </nav>
  )
}
