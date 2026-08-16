import { useState } from 'react'
import { colors, chamfer, withAlpha } from '../theme'

/** A field counts as present only when it holds non-blank text. */
const has = (v) => typeof v === 'string' && v.trim() !== ''

/** First letter of the first and last name. Single-word names give one letter. */
function initialsOf(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

const INITIALS_BG = withAlpha(colors.accent, 0.12)

/**
 * Square portrait, or a deliberate initials plate when there is no image.
 * A path that is set but fails to load warns in dev and falls back to the same
 * plate, so a wrong filename never ships as a broken-image icon.
 *
 * Fills its container's width — give the parent the size you want.
 *
 * @param {string} src       image path, or '' / undefined for the initials plate
 * @param {string} name      used for the alt text and the initials
 * @param {number} size      chamfer cut in px
 * @param {string} fontSize  CSS size for the initials
 * @param {string} aspect    CSS aspect-ratio for the frame; square by default
 * @param {string} context   tag for the dev warning, e.g. 'team' | 'events'
 */
export default function Portrait({ src, name, size, fontSize, aspect = '1 / 1', context = 'image' }) {
  // Track which src failed rather than a bare flag, so a new image path
  // retries on its own without an effect resetting state.
  const [failedSrc, setFailedSrc] = useState(null)

  const showInitials = !has(src) || failedSrc === src
  const frame = {
    ...chamfer(size),
    aspectRatio: aspect,
    background: showInitials ? INITIALS_BG : colors.card,
  }

  if (showInitials) {
    return (
      <div className="flex w-full items-center justify-center" style={frame} aria-hidden="true">
        <span
          className="font-display font-semibold leading-none"
          style={{ color: colors.accent, fontSize, letterSpacing: '0.02em' }}
        >
          {initialsOf(name)}
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      className="w-full object-cover"
      style={frame}
      onError={() => {
        if (import.meta.env.DEV) {
          console.warn(
            `[${context}] image failed to load for "${name}": ${src} — ` +
              `check the file exists in public${src} (extension and case must match). ` +
              `Falling back to initials.`,
          )
        }
        setFailedSrc(src)
      }}
    />
  )
}
