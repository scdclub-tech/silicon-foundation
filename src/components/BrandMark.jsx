import { colors } from '../theme'

/**
 * The club's mark, on its own so the real logo can replace it in one place.
 *
 * To swap in an artwork file, drop it in `public/images/` and return an <img>
 * from here instead — the size and the `aria-hidden` belong to the mark, and
 * every caller already treats it as decoration next to the "SCD" wordmark.
 */
export default function BrandMark({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
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
