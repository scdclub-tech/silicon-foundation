// FILL rule — see src/data/stories/*.js
//
// Story copy is drafted with 'FILL' standing in for text that has not been
// written or cleared yet. Anything still carrying that marker must render
// nothing at all, rather than leaking a placeholder onto a live page.

/** True when `value` is a string that is, or contains, the FILL marker. */
export function isFill(value) {
  return typeof value === 'string' && value.includes('FILL')
}

/**
 * The renderable form of a copy string: '' for anything FILL, and '' for
 * anything that is not a string at all, so callers can test truthiness.
 */
export function text(value) {
  if (typeof value !== 'string' || isFill(value)) return ''
  return value
}

/** True when `value` is a non-empty string that survives the FILL rule. */
export function hasText(value) {
  return text(value).length > 0
}
