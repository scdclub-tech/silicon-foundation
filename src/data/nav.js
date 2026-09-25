// src/data/nav.js
//
// The club site's primary navigation, and the single place that decides which
// pages are live. Setting `hidden: true` on an entry removes it from the navbar
// (desktop and mobile), turns any homepage panel that points at it into plain
// text, and redirects its route to the homepage — the page's own code is left
// untouched, so clearing the flag brings all of that back.

export const NAV = [
  { to: '/about', label: 'About', hidden: true },
  { to: '/domains', label: 'Domains', hidden: true },
  { to: '/programs', label: 'Programs', hidden: true },
  { to: '/events', label: 'Events' },
  { to: '/team', label: 'Team' },
  { to: '/playground', label: 'Playground' },
]

/** Nav entries that should appear in the navbar. */
export const VISIBLE_NAV = NAV.filter((n) => !n.hidden)

/** True when `path` belongs to a page that is currently hidden. */
export function isHidden(path) {
  return NAV.some((n) => n.to === path && n.hidden)
}
