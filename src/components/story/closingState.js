// src/components/story/closingState.js
//
// Which half of a dated closing band applies. Kept out of Closing.jsx because a
// component file that also exports a helper trips react-refresh.

/**
 * `before` stands until `switchAt`, `after` from that instant on — read from the
 * clock rather than a stored boolean, the same way the /join gate works, so the
 * band turns over on its own with no redeploy and nothing to remember to flip.
 *
 * A closing with neither half is returned as-is, so an undated story still works.
 *
 * @param {object|null} closing  the story's `closing` object
 * @param {Date} now             the instant to judge against
 */
export function currentClosing(closing, now = new Date()) {
  if (!closing) return null
  if (!closing.before && !closing.after) return closing

  const switchAt = new Date(closing.switchAt)
  const switched = !Number.isNaN(switchAt.getTime()) && now >= switchAt

  return (switched ? closing.after : closing.before) ?? closing.before ?? closing.after ?? null
}
