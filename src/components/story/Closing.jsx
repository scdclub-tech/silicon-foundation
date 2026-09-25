import { Link } from 'react-router-dom'
import { colors, fonts } from '../../theme'
import { hasText, text } from '../../lib/fill'

export default function Closing({ closing }) {
  if (!closing) return null

  const kicker = text(closing.kicker)
  const line = text(closing.line)
  const meta = text(closing.meta)
  const ctaLabel = text(closing.cta?.label)
  const ctaHref = hasText(closing.cta?.href) ? closing.cta.href : null
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
