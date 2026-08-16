// SCDC design tokens — single source of truth.
// Import from here; never hardcode hex values in new code.

export const colors = {
  cream: '#F7F6F2',            // page background
  card: '#E8E2D5',             // raised surface
  ink: '#14140F',              // primary text
  muted: '#6B6B60',            // secondary text
  accent: '#2563EB',           // links, highlights
  line: 'rgba(20,20,15,0.12)', // hairlines, borders
}

export const fonts = {
  display: "'Archivo', sans-serif",   // headings, UI
  body: "'Newsreader', serif",        // running text
  mono: "'IBM Plex Mono', monospace", // data, labels, metadata
}

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2.5rem',
  '2xl': '4rem',
  '3xl': '6rem',
}

export const radius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '14px',
  pill: '999px',
}

/**
 * Derive an alpha variant of a token hex, so tinted fills and borders still
 * trace back to the palette above rather than to a new hardcoded colour.
 *
 * @param {string} hex    a six-digit hex token, with or without the leading '#'
 * @param {number} alpha  0–1
 */
export function withAlpha(hex, alpha) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim())
  if (!m) return hex
  const int = parseInt(m[1], 16)
  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`
}

/**
 * 45-degree cut corners, the PCB/chip-package motif.
 * Returns a style object — spread it onto an element.
 *
 *   <div style={{ ...chamfer(14), background: colors.card }} />
 *
 * @param {number} size   cut length in px
 * @param {string[]} corners  any of 'tl' | 'tr' | 'br' | 'bl'
 */
export function chamfer(size = 12, corners = ['tl', 'tr', 'br', 'bl']) {
  const s = `${size}px`
  const has = (c) => corners.includes(c)

  const points = [
    has('tl') ? `${s} 0%` : '0% 0%',
    has('tr') ? `calc(100% - ${s}) 0%` : null,
    has('tr') ? `100% ${s}` : '100% 0%',
    has('br') ? `100% calc(100% - ${s})` : null,
    has('br') ? `calc(100% - ${s}) 100%` : '100% 100%',
    has('bl') ? `${s} 100%` : null,
    has('bl') ? `0% calc(100% - ${s})` : '0% 100%',
    has('tl') ? `0% ${s}` : null,
  ].filter(Boolean)

  return { clipPath: `polygon(${points.join(', ')})` }
}

export default { colors, fonts, spacing, radius, chamfer, withAlpha }
