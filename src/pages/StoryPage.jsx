import { Link, useParams } from 'react-router-dom'
import { colors, fonts, withAlpha } from '../theme'
import { getStory } from '../data/stories'
import { hasText, text } from '../lib/fill'
import Squeeze from '../components/story/Squeeze'
import Knobs from '../components/story/Knobs'
import Words from '../components/story/Words'
import Team from '../components/story/Team'
import Closing from '../components/story/Closing'
import { STORY_MOTION_CSS } from '../components/story/motionStyles'

// ── hairline and stat rules ────────────────────────────────────────────────
// The fin background and the floating photo come from STORY_MOTION_CSS, which
// the homepage panel shares. Only the stats band's own rules live here.
const STORY_CSS = `
/*
 * Stat figures are sized to the column they sit in, not to the viewport. The
 * coefficients come from each figure's measured width per px of font-size
 * (Top 3 3.60, 432→288 4.56, 33.3% 3.19, 4 of 4 3.59): a plain vw clamp fits
 * at 1440 but overflows everywhere below it, because the column narrows
 * faster than the viewport does.
 */
.story-stat-value { font-size: clamp(34px, 9vw, 64px); }
.story-stat-value--arrow { font-size: clamp(26px, 7vw, 52px); }
@media (min-width: 1024px) {
  .story-stat-value { font-size: clamp(34px, calc(7.6vw - 32px), 80px); }
  .story-stat-value--arrow { font-size: clamp(26px, calc(5.3vw - 22px), 56px); }
}
@media (min-width: 1024px) {
  .story-stats > * {
    padding-left: 32px;
    padding-right: 32px;
    border-left: 1px solid ${withAlpha(colors.ink, 0.14)};
  }
  .story-stats > *:first-child { padding-left: 0; border-left: 0; }
  .story-stats > *:last-child { padding-right: 0; }
}
`

// ── hero ───────────────────────────────────────────────────────────────────

function Hero({ hero }) {
  if (!hero) return null

  const backLabel = text(hero.backLabel)
  const index = text(hero.index)
  const kicker = text(hero.kicker)
  const title = text(hero.title)
  const subtitle = text(hero.subtitle)
  const tag = text(hero.tag)
  const metaLeft = text(hero.metaLeft)
  const metaRight = text(hero.metaRight)
  const image = hasText(hero.image?.src) ? hero.image : null

  const dim = withAlpha(colors.cream, 0.72)

  return (
    <section
      className="relative overflow-hidden px-6 pb-16 pt-8 md:px-20 md:pb-28 md:pt-12"
      style={{ background: colors.ink, color: colors.cream }}
    >
      <div className="story-fins pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto flex max-w-[1280px] flex-col">
        {(backLabel || index) && (
          <div
            className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.14em] md:text-[13px]"
            style={{ fontFamily: fonts.mono }}
          >
            {backLabel ? (
              <Link to={hero.backHref || '/'} className="no-underline hover:opacity-100" style={{ color: dim }}>
                {backLabel}
              </Link>
            ) : (
              <span />
            )}
            {index && <span style={{ color: dim }}>{index}</span>}
          </div>
        )}

        {kicker && (
          <div
            className="mt-14 text-[13px] uppercase tracking-[0.16em] md:mt-24 md:text-[15px]"
            style={{ fontFamily: fonts.mono, color: colors.accentLight }}
          >
            {kicker}
          </div>
        )}

        {title && (
          <h1
            className="mt-5"
            style={{
              fontFamily: fonts.display,
              fontSize: 'clamp(52px, 12.8vw, 184px)',
              lineHeight: 0.88,
              fontWeight: 850,
              fontStretch: '125%',
              letterSpacing: '-0.03em',
            }}
          >
            {title}
            <span style={{ color: colors.accent }}>.</span>
          </h1>
        )}

        {subtitle && (
          <p
            className="prose-serif mt-8 max-w-[960px] md:mt-10"
            style={{
              fontSize: 'clamp(19px, 2.1vw, 30px)',
              lineHeight: 1.4,
              fontWeight: 400,
              color: withAlpha(colors.cream, 0.82),
            }}
          >
            {subtitle}
          </p>
        )}

        {image && (
          <div className="story-float relative mt-14 md:mt-20">
            <img
              src={image.src}
              alt={text(image.alt)}
              className="block aspect-[1280/620] w-full object-cover"
              style={{
                borderRadius: '6px',
                boxShadow: `0 48px 96px rgba(0,0,0,0.55), 0 0 0 1px ${withAlpha(colors.cream, 0.14)}`,
              }}
            />
            {tag && (
              <div
                className="absolute -top-3 right-3 px-3 py-2 text-[12px] uppercase md:-top-6 md:right-12 md:px-5 md:py-3.5 md:text-[18px]"
                style={{
                  transform: 'rotate(4deg)',
                  background: colors.accent,
                  color: '#FFFFFF',
                  borderRadius: '4px',
                  fontFamily: fonts.mono,
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.35)',
                }}
              >
                {tag}
              </div>
            )}
          </div>
        )}

        {(metaLeft || metaRight) && (
          <div
            className="mt-7 flex flex-col gap-2 text-[11px] tracking-[0.06em] md:flex-row md:items-center md:justify-between md:gap-8 md:text-[13px]"
            style={{ fontFamily: fonts.mono, color: withAlpha(colors.cream, 0.66) }}
          >
            {metaLeft && <span>{metaLeft}</span>}
            {metaRight && <span>{metaRight}</span>}
          </div>
        )}
      </div>
    </section>
  )
}

// ── stats band ─────────────────────────────────────────────────────────────

// '432→288' reads as one figure, so the arrow is tinted in place rather than
// split into its own element.
function StatValue({ value, accentArrow }) {
  if (!accentArrow || !value.includes('→')) return value
  return value.split('→').map((part, i, all) => (
    <span key={i}>
      {part}
      {i < all.length - 1 && <span style={{ color: colors.accent }}>→</span>}
    </span>
  ))
}

function Stats({ stats }) {
  const items = (stats ?? []).filter((s) => hasText(s?.value))
  if (items.length === 0) return null

  return (
    <section
      className="story-stats mx-auto grid max-w-[1440px] grid-cols-2 gap-x-4 gap-y-10 px-6 py-16 md:px-20 md:py-20 lg:grid-cols-4 lg:gap-x-0 lg:gap-y-0"
      style={{ borderBottom: `1px solid ${withAlpha(colors.ink, 0.14)}` }}
    >
      {items.map((s) => (
        <div key={s.value} className="flex flex-col gap-3.5">
          <div
            className={`story-stat-value${s.accentArrow ? ' story-stat-value--arrow' : ''}`}
            style={{
              fontFamily: fonts.display,
              lineHeight: 1,
              fontWeight: 800,
              fontStretch: s.accentArrow ? '100%' : '112%',
              letterSpacing: s.accentArrow ? '-0.03em' : '-0.02em',
            }}
          >
            <StatValue value={s.value} accentArrow={s.accentArrow} />
          </div>
          {hasText(s.label) && (
            <div
              className="text-[11px] uppercase tracking-[0.12em] md:text-[13px]"
              style={{ fontFamily: fonts.mono, color: colors.mutedDeep }}
            >
              {text(s.label)}
            </div>
          )}
        </div>
      ))}
    </section>
  )
}

// ── not found ──────────────────────────────────────────────────────────────

function StoryNotFound() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24 md:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: colors.muted }}>
        — 404
      </p>
      <h1
        className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl"
        style={{ color: colors.ink }}
      >
        Story not found
      </h1>
      <Link to="/" className="mt-8 inline-block font-mono text-[12px]" style={{ color: colors.accent }}>
        ← Back home
      </Link>
    </main>
  )
}

// ── page ───────────────────────────────────────────────────────────────────

export default function StoryPage() {
  const { slug } = useParams()
  const story = getStory(slug)

  if (!story) return <StoryNotFound />

  return (
    <main style={{ background: colors.cream, color: colors.ink }}>
      <style>{STORY_MOTION_CSS + STORY_CSS}</style>

      <Hero hero={story.hero} />
      <Stats stats={story.stats} />

      <Words words={story.mentor} quoteMark />
      <Squeeze squeeze={story.squeeze} />
      <Knobs knobs={story.knobs} />
      <Words words={story.president} bordered />
      <Words words={story.teammate} bordered />
      <Team team={story.team} kicker={story.teamKicker} />
      <Closing closing={story.closing} />
    </main>
  )
}
