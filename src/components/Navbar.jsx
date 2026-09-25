import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { colors, fonts } from '../theme'
import { VISIBLE_NAV as LINKS } from '../data/nav'
import BrandMark from './BrandMark'

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

  // `no-underline` must not be in the base: Tailwind emits it after `underline`
  // in the utilities layer, so it would win on the active link regardless of order.
  const linkClass = ({ isActive }) =>
    `text-[13px] transition-colors ${
      isActive
        ? 'underline decoration-1 underline-offset-[6px]'
        : 'no-underline hover:opacity-70'
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
          <BrandMark />
          <span className="flex flex-col leading-tight">
            <span
              className="text-[15px] uppercase tracking-[0.04em]"
              style={{
                fontFamily: fonts.display,
                fontWeight: 800,
                fontStretch: '115%',
                color: colors.ink,
              }}
            >
              SCD
            </span>
            {/* the full name is the first thing to go when space is tight */}
            <span
              className="hidden text-[12.5px] md:block"
              style={{ fontFamily: fonts.display, fontWeight: 500, color: colors.muted }}
            >
              Semiconductor Chip Design Club · SRMIST
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
