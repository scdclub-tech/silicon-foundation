import { colors, fonts, withAlpha } from '../../theme'
import { hasText, text } from '../../lib/fill'

// ── one knob ───────────────────────────────────────────────────────────────

function KnobCard({ knob, n }) {
  const lit = Boolean(knob.lit)

  return (
    <div
      className="box-border flex flex-col justify-between rounded-lg p-7"
      style={{
        minHeight: 260,
        background: lit ? colors.ink : 'transparent',
        color: lit ? colors.cream : colors.ink,
        border: lit ? 'none' : `1px solid ${withAlpha(colors.ink, 0.16)}`,
        boxShadow: lit ? `0 24px 48px ${withAlpha(colors.accent, 0.25)}` : 'none',
      }}
    >
      <div
        className="tracking-[0.12em]"
        style={{
          fontFamily: fonts.mono,
          fontSize: 12,
          color: lit ? colors.accentLight : colors.mutedDeep,
        }}
      >
        KNOB {String(n).padStart(2, '0')}
      </div>

      {hasText(knob.name) && (
        <div style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 700, lineHeight: 1.15 }}>
          {text(knob.name)}
        </div>
      )}

      <div className="flex flex-col gap-1">
        {hasText(knob.value) && (
          <span
            style={{
              fontFamily: fonts.display,
              fontSize: 44,
              fontWeight: 800,
              color: lit ? colors.accentLight : colors.inert,
            }}
          >
            {text(knob.value)}
          </span>
        )}
        {hasText(knob.why) && (
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: 12,
              color: lit ? withAlpha(colors.cream, 0.72) : colors.mutedDeep,
            }}
          >
            {text(knob.why)}
          </span>
        )}
      </div>
    </div>
  )
}

// ── section ────────────────────────────────────────────────────────────────

export default function Knobs({ knobs }) {
  const items = (knobs?.items ?? []).filter((k) => k && (hasText(k.name) || hasText(k.value)))
  if (items.length === 0) return null

  const kicker = text(knobs.kicker)
  const heading = text(knobs.heading)

  return (
    <section className="mx-auto flex max-w-[1280px] flex-col gap-6 px-6 py-24 md:px-20 md:py-32">
      {kicker && (
        <div
          className="text-[11px] uppercase tracking-[0.14em] md:text-[13px]"
          style={{ fontFamily: fonts.mono, color: colors.accent }}
        >
          {kicker}
        </div>
      )}
      {heading && (
        <h2
          style={{
            fontFamily: fonts.display,
            fontSize: 'clamp(40px, 5vw, 72px)',
            lineHeight: 0.95,
            fontWeight: 800,
            fontStretch: '112%',
            letterSpacing: '-0.02em',
          }}
        >
          {heading}
        </h2>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map((k, i) => (
          <KnobCard key={k.name ?? i} knob={k} n={i + 1} />
        ))}
      </div>
    </section>
  )
}
