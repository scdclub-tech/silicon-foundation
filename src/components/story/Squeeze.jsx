import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { colors, fonts, withAlpha } from '../../theme'
import { hasText, text } from '../../lib/fill'

// ── drawing geometry ───────────────────────────────────────────────────────
// The cell is drawn at 1 px = 1 nm, so every number below is a real dimension
// and the three runs differ only in `pitch` and `height`.

const STAGE_W = 733 // the panel's width at the 1440 reference
const STAGE_H = 680
const BOX_X = 170 // cell box, top-left within the stage
const BOX_Y = 200
const BOX_W = 360
const BASELINE_H = 432 // R000, the height every later run is measured against
const FIN_H = 28 // fin width, held constant across runs
const FIN_COUNT = 4
const FIN_OVERHANG = 24 // fins run past the cell boundary on both sides
const DIM_OFFSET = 44 // the dimension line, right of the box

/** Top edge of fin `i`: the fins sit on pitch centres, so pitch alone moves them. */
function finTop(pitch, i) {
  return pitch * i + pitch / 2 - FIN_H / 2
}

const FINS = Array.from({ length: FIN_COUNT }, (_, i) => i)

// The sealed gaps and the reduced-motion rule cannot be expressed inline.
const SQUEEZE_CSS = `
.squeeze-seal {
  background-image: repeating-linear-gradient(
    135deg,
    ${colors.warnDeep} 0 3px,
    ${withAlpha(colors.warnDeep, 0.35)} 3px 7px
  );
}
`

/**
 * The drawing is laid out at its true nanometre size and then scaled to
 * whatever width the column gives it, so the geometry stays exact at every
 * breakpoint instead of being re-guessed per breakpoint.
 */
function useStageScale() {
  const ref = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      if (w > 0) setScale(Math.min(w / STAGE_W, 1))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return [ref, scale]
}

// ── the panel ──────────────────────────────────────────────────────────────

function Panel({ run, isBaseline, motionProps }) {
  const [ref, scale] = useStageScale()
  const failed = Boolean(run.failed)
  const pitch = run.pitch
  const readoutColor = failed ? colors.warn : colors.cream
  const dim = withAlpha(colors.cream, 0.6)

  // Everything the failed state re-colours.
  const boxBorder = failed
    ? `1.5px dashed ${colors.warn}`
    : `1.5px solid ${isBaseline ? withAlpha(colors.cream, 0.75) : colors.cream}`

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: colors.ink, borderRadius: '10px', height: STAGE_H * scale }}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <div
          className="absolute uppercase tracking-[0.14em]"
          style={{ top: 36, left: 40, fontFamily: fonts.mono, fontSize: 12, color: dim }}
        >
          Cell height
        </div>
        <div
          className="absolute uppercase tracking-[0.14em]"
          style={{ top: 36, right: 40, fontFamily: fonts.mono, fontSize: 12, color: dim }}
        >
          Fin pitch · Size Threshold unchanged
        </div>

        {hasText(run.readout) && (
          <div
            className="absolute"
            style={{
              top: 60,
              left: 40,
              fontFamily: fonts.display,
              fontSize: 72,
              fontWeight: 800,
              fontStretch: '110%',
              color: readoutColor,
            }}
          >
            {text(run.readout)}
          </div>
        )}
        <div
          className="absolute"
          style={{
            top: 76,
            right: 40,
            fontFamily: fonts.mono,
            fontSize: 40,
            color: failed ? colors.warn : colors.accentLight,
          }}
        >
          {pitch}
        </div>

        {/* the 432 nm baseline, left behind by every run that shrank it */}
        {!isBaseline && (
          <div
            className="absolute box-border"
            style={{
              top: BOX_Y,
              left: BOX_X,
              width: BOX_W,
              height: BASELINE_H,
              border: `1.5px dashed ${withAlpha(colors.cream, 0.25)}`,
            }}
          />
        )}
        {!isBaseline && !failed && (
          <div
            className="absolute"
            style={{
              top: BOX_Y + BASELINE_H - 28,
              left: BOX_X + 20,
              fontFamily: fonts.mono,
              fontSize: 12,
              color: withAlpha(colors.cream, 0.5),
            }}
          >
            baseline outline · {BASELINE_H} nm
          </div>
        )}

        {/* the cell itself */}
        <motion.div
          className="absolute box-border"
          style={{ top: BOX_Y, left: BOX_X, width: BOX_W, border: boxBorder }}
          animate={{ height: run.height }}
          initial={false}
          transition={motionProps}
        >
          {/* sealed gaps — only on a run that failed */}
          {failed &&
            FINS.slice(0, FIN_COUNT - 1).map((i) => (
              <motion.div
                key={`seal-${i}`}
                className="squeeze-seal absolute"
                style={{ left: -FIN_OVERHANG, right: -FIN_OVERHANG }}
                animate={{ top: finTop(pitch, i) + FIN_H, height: pitch - FIN_H }}
                initial={false}
                transition={motionProps}
              />
            ))}

          {FINS.map((i) => (
            <motion.div
              key={`fin-${i}`}
              className="absolute"
              style={{
                left: -FIN_OVERHANG,
                right: -FIN_OVERHANG,
                height: FIN_H,
                background: colors.accentLight,
                borderRadius: '2px',
              }}
              animate={{ top: finTop(pitch, i) }}
              initial={false}
              transition={motionProps}
            />
          ))}

          {/* dimension line — the failed run is measured by its stamp instead */}
          {!failed && (
            <>
              <div
                className="absolute top-0"
                style={{
                  right: -DIM_OFFSET,
                  width: 1,
                  height: '100%',
                  background: isBaseline ? withAlpha(colors.cream, 0.6) : colors.cream,
                }}
              />
              <div
                className="absolute -translate-y-1/2"
                style={{
                  top: '50%',
                  right: -118,
                  fontFamily: fonts.mono,
                  fontSize: 13,
                  color: isBaseline ? withAlpha(colors.cream, 0.8) : colors.cream,
                }}
              >
                {run.height} nm
              </div>
            </>
          )}

          {failed && (
            <div
              className="absolute"
              style={{
                top: 88,
                left: 70,
                transform: 'rotate(-8deg)',
                padding: '10px 18px',
                border: `3px solid ${colors.warn}`,
                color: colors.warn,
                background: colors.ink,
                fontFamily: fonts.mono,
                fontSize: 26,
                fontWeight: 500,
                letterSpacing: '0.2em',
              }}
            >
              SEALED
            </div>
          )}
        </motion.div>

        {hasText(run.note) && (
          <div
            className="absolute"
            style={{
              top: BOX_Y + run.height + 28,
              left: BOX_X,
              width: 420,
              fontFamily: fonts.mono,
              fontSize: 13,
              lineHeight: 1.6,
              color: failed ? colors.warn : colors.accentLight,
            }}
          >
            {text(run.note)}
          </div>
        )}
      </div>
    </div>
  )
}

// ── run picker ─────────────────────────────────────────────────────────────

function RunButton({ run, selected, onPick }) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={selected}
      className="flex items-center gap-5 rounded-lg px-6 text-left"
      style={{
        height: 72,
        border: `1.5px solid ${selected ? colors.ink : withAlpha(colors.ink, 0.28)}`,
        background: selected ? colors.ink : 'transparent',
        color: selected ? colors.cream : colors.ink,
        fontFamily: fonts.display,
        fontSize: 18,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: 14,
          width: 56,
          color: selected ? colors.accentLight : colors.accent,
        }}
      >
        {text(run.run)}
      </span>
      <span className="grow">{text(run.pitchLabel)}</span>
      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: 13,
          fontWeight: 400,
          color: selected ? withAlpha(colors.cream, 0.72) : colors.mutedDeep,
        }}
      >
        {text(run.outcome)}
      </span>
    </button>
  )
}

// ── section ────────────────────────────────────────────────────────────────

export default function Squeeze({ squeeze }) {
  const runs = (squeeze?.runs ?? []).filter((r) => r && hasText(r.id))
  const [activeId, setActiveId] = useState(runs[0]?.id)
  const reduced = useReducedMotion()

  if (runs.length === 0) return null

  const active = runs.find((r) => r.id === activeId) ?? runs[0]
  const isBaseline = active.id === runs[0].id
  const motionProps = reduced ? { duration: 0 } : { duration: 0.5, ease: [0.4, 0, 0.2, 1] }

  const kicker = text(squeeze.kicker)
  const headingLines = (squeeze.headingLines ?? []).filter(hasText)

  return (
    <section style={{ background: colors.card }}>
      <style>{SQUEEZE_CSS}</style>
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-x-8 gap-y-12 px-6 py-24 md:px-20 md:py-32 lg:grid-cols-12 lg:items-start">
        <div className="flex flex-col gap-6 lg:col-span-5">
          {kicker && (
            <div
              className="text-[11px] uppercase tracking-[0.14em] md:text-[13px]"
              style={{ fontFamily: fonts.mono, color: colors.accent }}
            >
              {kicker}
            </div>
          )}
          {headingLines.length > 0 && (
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
              {headingLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          )}

          {hasText(active.text) && (
            <p
              className="prose-serif"
              style={{ fontSize: 'clamp(18px, 1.7vw, 23px)', lineHeight: 1.5, minHeight: 150 }}
            >
              {text(active.text)}
            </p>
          )}

          <div role="group" aria-label="Choose a run" className="mt-2 flex flex-col gap-2.5">
            {runs.map((r) => (
              <RunButton
                key={r.id}
                run={r}
                selected={r.id === active.id}
                onPick={() => setActiveId(r.id)}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <Panel run={active} isBaseline={isBaseline} motionProps={motionProps} />
        </div>
      </div>
    </section>
  )
}
