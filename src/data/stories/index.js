// src/data/stories/index.js
//
// The story registry. Plain data only — /stories/:slug looks a story up here,
// so adding a story means adding its module to STORIES and nothing else.

import { semiconIndia2026 } from './semiconIndia2026'

export const STORIES = [semiconIndia2026]

/** The story with this slug, or null when there is no such story. */
export function getStory(slug) {
  return STORIES.find((s) => s.slug === slug) ?? null
}
