import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { colors, fonts } from '../../theme'
import { hasText, text } from '../../lib/fill'
import { currentClosing } from './closingState'

// setTimeout saturates past this, firing immediately; beyond it the band simply
// waits for the next page load, which is the safe direction to fail.
const MAX_TIMEOUT_MS = 2_147_483_647

export default function Closing({ closing }) {
  // Seeded from the clock, then flipped by a single timeout, so a tab left open
  // across the switch turns over without a reload — as /join does.
  const [now, setNow] = useState(() => new Date())

  const switchMs = closing?.switchAt ? new Date(closing.switchAt).getTime() : NaN
  const pending = Number.isFinite(switchMs) && switchMs > now.getTime()

  useEffect(() => {
    if (!pending) return undefined
    const msLeft = switchMs - Date.now()
    if (msLeft > MAX_TIMEOUT_MS) return undefined
    const id = setTimeout(() => setNow(new Date()), Math.max(msLeft, 0))
    return () => clearTimeout(id)
  }, [pending, switchMs])

  const active = currentClosing(closing, now)
  if (!active) return null

  const kicker = text(active.kicker)
  const line = text(active.line)
  const meta = text(active.meta)
  const ctaLabel = text(active.cta?.label)
  const ctaHref = hasText(active.cta?.href) ? active.cta.href : null
  const showCta = Boolean(ctaLabel && ctaHref)

  if (!kicker && !line && !meta && !showCta) return null

  const pill = {
    background: colors.ink,
    color: colors.cream,
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: 600,
  }

  return (
    <section style={{ background: colors.accent, color: '#FFFFFF' }}>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-6 py-24 md:px-20 md:py-[120px]">
        {kicker && (
          <div
            className="text-[11px] uppercase tracking-[0.14em] md:text-[13px]"
            style={{ fontFamily: fonts.mono }}
          >
            {kicker}
          </div>
        )}

        {line && (
          <h2
            className="max-w-[1200px]"
            style={{
              fontFamily: fonts.display,
              fontSize: 'clamp(40px, 7.2vw, 104px)',
              lineHeight: 0.92,
              fontWeight: 850,
              fontStretch: '118%',
              letterSpacing: '-0.025em',
            }}
          >
            {line}
          </h2>
        )}

        {(showCta || meta) && (
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
            {showCta && (
              <Link
                to={ctaHref}
                className="inline-flex h-[60px] items-center gap-3 rounded-full px-8 no-underline"
                style={pill}
              >
                {ctaLabel}
                <span aria-hidden="true">→</span>
              </Link>
            )}
            {meta && <span style={{ fontFamily: fonts.mono, fontSize: 14 }}>{meta}</span>}
          </div>
        )}
      </div>
    </section>
  )
}
