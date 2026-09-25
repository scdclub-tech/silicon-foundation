import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { colors, fonts, withAlpha } from '../../theme'
import { hasText, text } from '../../lib/fill'
import { STORY_MOTION_CSS } from './motionStyles'

// Type that changes weight or width across the breakpoint, which inline styles
// cannot express. Sizes are the Main.dc.html values as a ceiling and the
// HomeMobile.dc.html values as a floor, so both references land exactly.
const PANEL_CSS = `
.triumph-title {
  font-family: ${fonts.display};
  font-size: clamp(52px, 18.5vw, 72px);
  line-height: 0.88;
  font-weight: 850;
  font-stretch: 118%;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 28px rgba(0,0,0,0.6);
}
.triumph-result { font-size: clamp(22px, 2.08vw, 30px); font-weight: 700; font-stretch: 110%; }
.triumph-cta { height: 56px; font-size: 17px; }
@media (min-width: 768px) {
  .triumph-title {
    font-size: clamp(72px, 11.94vw, 172px);
    line-height: 0.86;
    font-stretch: 125%;
    letter-spacing: -0.025em;
    text-shadow: 0 6px 40px rgba(0,0,0,0.55);
  }
  .triumph-cta { height: clamp(48px, 4.17vw, 60px); font-size: clamp(15px, 1.25vw, 18px); }
}
`

export default function TriumphPanel({ panel, to }) {
  const reduce = useReducedMotion()
  if (!panel) return null

  const label = text(panel.label)
  const location = text(panel.location)
  const lines = (panel.titleLines ?? []).filter(hasText).map(text)
  const tag = text(panel.tag)
  const result = text(panel.result)
  const event = text(panel.event)
  const cta = text(panel.cta)
  const caption = text(panel.image?.caption)
  const image = hasText(panel.image?.src) ? panel.image : null

  if (!label && lines.length === 0 && !result && !image) return null

  const dim = withAlpha(colors.cream, 0.72)

  // The same entrance the other homepage panels use.
  const reveal = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.6, ease: 'easeOut' },
      }

  return (
    <motion.section
      {...reveal}
      aria-labelledby="triumph-heading"
      className="relative w-full overflow-hidden"
      style={{ background: colors.ink, color: colors.cream }}
    >
      <style>{STORY_MOTION_CSS + PANEL_CSS}</style>
      <div className="story-fins pointer-events-none absolute inset-0" aria-hidden="true" />

      {/*
        One link for the whole panel. Below 768px the parts stack in reading
        order; from 768px they take the Main.dc.html positions, given as
        percentages of its 1440x900 canvas so the composition keeps its
        proportions and the title still crosses the photo's edge.
      */}
      <Link
        to={to}
        className="relative mx-auto block max-w-[1440px] px-5 pb-9 pt-8 no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-6px] md:aspect-[1440/900] md:p-0"
        style={{ color: colors.cream, outlineColor: colors.accentLight }}
      >
        {(label || location) && (
          <div
            className="flex justify-between gap-4 text-[11px] uppercase tracking-[0.14em] md:absolute md:left-[5.56%] md:right-[5.56%] md:top-[5.33%] md:text-[clamp(11px,0.9vw,13px)]"
            style={{ fontFamily: fonts.mono, color: dim }}
          >
            {label && <span>{label}</span>}
            {location && <span className="hidden md:inline">{location}</span>}
          </div>
        )}

        {image && (
          <div
            className="story-float-tilt relative mx-auto mt-14 w-full max-w-[334px] md:absolute md:right-[6.67%] md:top-[16.67%] md:mt-0 md:h-[51.11%] md:w-[44.44%] md:max-w-none"
            style={{ transform: 'rotate(-2deg)' }}
          >
            <img
              src={image.src}
              alt={text(image.alt)}
              loading="lazy"
              className="block aspect-[334/250] w-full object-cover md:aspect-auto md:h-full"
              style={{
                borderRadius: '6px',
                boxShadow: `0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px ${withAlpha(colors.cream, 0.14)}`,
              }}
            />
            {tag && (
              <div
                className="absolute -right-3 -top-4 px-3 py-2 text-[14px] md:-right-7 md:-top-[22px] md:px-[18px] md:py-3 md:text-[clamp(14px,1.25vw,18px)]"
                style={{
                  transform: 'rotate(5deg)',
                  background: colors.accent,
                  color: '#FFFFFF',
                  borderRadius: '4px',
                  fontFamily: fonts.mono,
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.35)',
                }}
              >
                {tag}
              </div>
            )}
            {caption && (
              <div
                className="absolute -bottom-10 left-0 hidden tracking-[0.08em] md:block md:text-[clamp(10px,0.83vw,12px)]"
                style={{ fontFamily: fonts.mono, color: withAlpha(colors.cream, 0.6) }}
              >
                {caption}
              </div>
            )}
          </div>
        )}

        {/* after the photo in source order, so it paints over the photo's edge */}
        {lines.length > 0 && (
          <h2
            id="triumph-heading"
            className="triumph-title relative -mt-10 md:absolute md:left-[5%] md:top-[19.78%] md:mt-0"
          >
            {lines.map((line, i) => (
              <span key={line} className="block">
                {line}
                {i === lines.length - 1 && <span style={{ color: colors.accent }}>.</span>}
              </span>
            ))}
          </h2>
        )}

        {(result || event || cta) && (
          <div className="mt-10 flex flex-col items-stretch gap-6 md:absolute md:bottom-[7.11%] md:left-[5.56%] md:right-[5.56%] md:mt-0 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="flex flex-col gap-2.5">
              {result && (
                <div className="triumph-result" style={{ fontFamily: fonts.display }}>
                  {result}
                </div>
              )}
              {event && (
                <div
                  className="text-[12px] leading-relaxed tracking-[0.03em] md:text-[clamp(11px,0.97vw,14px)] md:leading-normal md:tracking-[0.04em]"
                  style={{ fontFamily: fonts.mono, color: dim }}
                >
                  {event}
                </div>
              )}
            </div>

            {cta && (
              <div
                className="triumph-cta flex items-center justify-center gap-3 rounded-full px-8 md:inline-flex md:w-auto md:shrink-0"
                style={{
                  background: colors.cream,
                  color: colors.ink,
                  fontFamily: fonts.display,
                  fontWeight: 600,
                }}
              >
                {cta}
                <span aria-hidden="true">→</span>
              </div>
            )}
          </div>
        )}
      </Link>
    </motion.section>
  )
}
