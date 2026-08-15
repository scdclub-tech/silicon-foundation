import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { colors, chamfer } from '../theme'
import { TEAM } from '../data/team'

// ── helpers ────────────────────────────────────────────────────────────────

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

/**
 * The data file stores some links bare ('www.linkedin.com/in/…'), which the
 * browser would resolve as a relative path. Force an absolute scheme.
 */
function normalizeUrl(url) {
  const trimmed = String(url || '').trim()
  if (!trimmed) return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

/** Derive an alpha variant of a token hex so colors still come from theme.js. */
function withAlpha(hex, alpha) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim())
  if (!m) return hex
  const int = parseInt(m[1], 16)
  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`
}

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const EASE_ARRAY = [0.22, 1, 0.36, 1]
const HOVER_BORDER = withAlpha(colors.ink, 0.4)
const INITIALS_BG = withAlpha(colors.accent, 0.12)

/**
 * Column count for a section, kept in JS so the panel knows which grid row the
 * clicked card sits in. The grid template is driven from the same number, so
 * the layout and the row maths can never disagree.
 */
function useColumnCount(desktopCols) {
  const query = useMemo(
    () => [
      { mq: `(min-width: 1024px)`, cols: desktopCols },
      { mq: `(min-width: 480px)`, cols: 2 },
    ],
    [desktopCols],
  )

  const read = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return desktopCols
    const hit = query.find((q) => window.matchMedia(q.mq).matches)
    return hit ? hit.cols : 1
  }, [query, desktopCols])

  const [cols, setCols] = useState(read)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const lists = query.map((q) => window.matchMedia(q.mq))
    const update = () => setCols(read())
    lists.forEach((l) => l.addEventListener('change', update))
    update()
    return () => lists.forEach((l) => l.removeEventListener('change', update))
  }, [query, read])

  return cols
}

// ── photo ──────────────────────────────────────────────────────────────────

/**
 * Square portrait, or a deliberate initials plate when there is no image.
 * A path that is set but fails to load warns in dev and falls back to the same
 * plate, so a wrong filename never ships as a broken-image icon.
 */
function Portrait({ member, size, fontSize }) {
  // Track which src failed rather than a bare flag, so a new image path
  // retries on its own without an effect resetting state.
  const [failedSrc, setFailedSrc] = useState(null)

  const showInitials = !has(member.image) || failedSrc === member.image
  const frame = {
    ...chamfer(size),
    aspectRatio: '1 / 1',
    background: showInitials ? INITIALS_BG : colors.card,
  }

  if (showInitials) {
    return (
      <div className="flex w-full items-center justify-center" style={frame} aria-hidden="true">
        <span
          className="font-display font-semibold leading-none"
          style={{ color: colors.accent, fontSize, letterSpacing: '0.02em' }}
        >
          {initialsOf(member.name)}
        </span>
      </div>
    )
  }

  return (
    <img
      src={member.image}
      alt={member.name}
      loading="lazy"
      className="w-full object-cover"
      style={frame}
      onError={() => {
        if (import.meta.env.DEV) {
          console.warn(
            `[team] image failed to load for "${member.name}": ${member.image} — ` +
              `check the file exists in public${member.image} (extension and case must match). ` +
              `Falling back to initials.`,
          )
        }
        setFailedSrc(member.image)
      }}
    />
  )
}

// ── hover / motion rules ───────────────────────────────────────────────────
// Inline styles cannot express media queries, and hover has to be gated on
// pointer capability and reduced-motion. Colors still come from theme.js.
const CARD_CSS = `
.scdc-card {
  position: relative;
  transition: transform 250ms ${EASE}, border-color 250ms ${EASE}, opacity 250ms ${EASE};
  transform-origin: center;
}
.scdc-card:focus-visible {
  outline: 2px solid ${colors.accent};
  outline-offset: 3px;
}
@media (hover: hover) and (pointer: fine) {
  .scdc-card { cursor: pointer; }
  .scdc-card:hover {
    transform: scale(1.03);
    border-color: ${HOVER_BORDER};
    z-index: 1;
  }
}
@media (pointer: coarse), (prefers-reduced-motion: reduce) {
  .scdc-card, .scdc-card:hover {
    transform: none;
    transition: none;
  }
}
`

// ── collapsed card ─────────────────────────────────────────────────────────

function MemberCard({ member, expanded, dimmed, panelId, onToggle, buttonRef }) {
  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={onToggle}
      aria-expanded={expanded}
      aria-controls={expanded ? panelId : undefined}
      className="scdc-card block w-full border bg-transparent p-3 text-left"
      style={{
        borderColor: expanded ? HOVER_BORDER : colors.line,
        opacity: dimmed ? 0.4 : 1,
        ...chamfer(10),
      }}
    >
      <Portrait member={member} size={8} fontSize="2rem" />
      <div className="mt-3 font-display text-[15px] font-semibold leading-snug" style={{ color: colors.ink }}>
        {member.name}
      </div>
      <div
        className="mt-1 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em]"
        style={{ color: colors.muted }}
      >
        {member.role}
      </div>
    </button>
  )
}

// ── icon links ─────────────────────────────────────────────────────────────

const ICONS = {
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05a4.2 4.2 0 0 1 3.75-2c4 0 4.75 2.6 4.75 6V21h-4v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4z" />
  ),
  github: (
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2z" />
  ),
}

function IconLink({ kind, url, name }) {
  const label = kind === 'linkedin' ? 'LinkedIn' : 'GitHub'
  return (
    <a
      href={normalizeUrl(url)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} on ${label}`}
      title={label}
      className="inline-flex h-8 w-8 items-center justify-center border no-underline"
      style={{ borderColor: colors.line, color: colors.muted, ...chamfer(5) }}
      onMouseEnter={(e) => (e.currentTarget.style.color = colors.accent)}
      onMouseLeave={(e) => (e.currentTarget.style.color = colors.muted)}
    >
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true" focusable="false">
        {ICONS[kind]}
      </svg>
    </a>
  )
}

// ── expanded panel ─────────────────────────────────────────────────────────

// Flip to true once src/data/projects.js exists; the stub stays hidden until then.
const HAS_PROJECTS = false

function MemberPanel({ member, panelId, onClose, panelRef }) {
  const showLinkedin = has(member.linkedin)
  const showGithub = has(member.github)
  const showLinks = showLinkedin || showGithub
  const showSince = has(member.since)
  const showFocus = has(member.focus)

  return (
    <div
      id={panelId}
      ref={panelRef}
      role="region"
      tabIndex={-1}
      aria-label={`${member.name}, ${member.role}`}
      className="relative border p-6 focus:outline-none md:p-8"
      style={{ borderColor: colors.line, background: colors.card, ...chamfer(14) }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={`Close details for ${member.name}`}
        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center bg-transparent font-display text-[15px] leading-none"
        style={{ color: colors.muted, cursor: 'pointer' }}
      >
        ✕
      </button>

      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        {/* photo column — fixed 140px on sm and up, stacked above content below */}
        <div className="w-[140px] shrink-0">
          <Portrait member={member} size={10} fontSize="2.5rem" />
          {showLinks && (
            <div className="mt-3 flex items-center gap-2">
              {showLinkedin && <IconLink kind="linkedin" url={member.linkedin} name={member.name} />}
              {showGithub && <IconLink kind="github" url={member.github} name={member.name} />}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 pr-6 sm:pr-8">
          <h3 className="font-display text-2xl font-semibold leading-tight" style={{ color: colors.ink }}>
            {member.name}
          </h3>
          <div
            className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em]"
            style={{ color: colors.muted }}
          >
            <span>{member.role}</span>
            {showSince && (
              <>
                <span aria-hidden="true"> · </span>
                <span>{member.since}</span>
              </>
            )}
          </div>

          <hr className="my-5 border-0 border-t" style={{ borderColor: colors.line }} />

          {showFocus && (
            <div>
              <div
                className="font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: colors.muted }}
              >
                Focus
              </div>
              <p className="prose-serif mt-2 max-w-2xl text-[16px] leading-relaxed" style={{ color: colors.ink }}>
                {member.focus}
              </p>
            </div>
          )}

          {HAS_PROJECTS && (
            <div className={showFocus ? 'mt-6' : ''}>
              <div
                className="font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: colors.muted }}
              >
                Projects
              </div>
              <div className="mt-2">
                {/* projects list mounts here */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── section ────────────────────────────────────────────────────────────────

function TeamSection({ id, label, members, desktopCols, selected, onSelect }) {
  const cols = useColumnCount(desktopCols)
  const reduceMotion = useReducedMotion()
  const panelRef = useRef(null)
  const buttonRefs = useRef(new Map())
  const pendingFocus = useRef(null)

  const selectedIndex = members.findIndex((m) => m.name === selected)
  const isOpen = selectedIndex >= 0
  const panelId = `${id}-panel`

  // Focus moves into the panel on open and back to the triggering card on close.
  useEffect(() => {
    // preventScroll: the panel opens directly under the card the user just
    // clicked, so it is already in view — letting focus scroll lurches the page.
    if (isOpen && panelRef.current) panelRef.current.focus({ preventScroll: true })
  }, [isOpen, selected])

  const close = useCallback(() => {
    pendingFocus.current = selected
    onSelect(null)
  }, [selected, onSelect])

  useEffect(() => {
    if (isOpen || !pendingFocus.current) return
    buttonRefs.current.get(pendingFocus.current)?.focus()
    pendingFocus.current = null
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, close])

  // Chunk into visual rows so the panel can be injected after the row that
  // holds the clicked card, pushing the rows below it down.
  const rows = []
  for (let i = 0; i < members.length; i += cols) rows.push({ start: i, items: members.slice(i, i + cols) })

  const transition = reduceMotion ? { duration: 0 } : { duration: 0.35, ease: EASE_ARRAY }

  return (
    <section className="mt-16" aria-labelledby={`${id}-heading`}>
      <h2
        id={`${id}-heading`}
        className="font-mono text-[11px] uppercase tracking-[0.18em]"
        style={{ color: colors.muted }}
      >
        {label}
      </h2>

      <div
        className="mt-6 grid gap-5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {rows.map((row) => {
          const rowHasPanel = isOpen && selectedIndex >= row.start && selectedIndex < row.start + cols
          return (
            <Fragment key={row.start}>
              {row.items.map((m) => (
                <MemberCard
                  key={m.name}
                  member={m}
                  expanded={selected === m.name}
                  dimmed={isOpen && selected !== m.name}
                  panelId={panelId}
                  onToggle={() => (selected === m.name ? close() : onSelect(m.name))}
                  buttonRef={(el) => {
                    if (el) buttonRefs.current.set(m.name, el)
                    else buttonRefs.current.delete(m.name)
                  }}
                />
              ))}

              <AnimatePresence initial={false}>
                {rowHasPanel && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={transition}
                    style={{ gridColumn: '1 / -1', overflow: 'hidden' }}
                  >
                    <MemberPanel
                      member={members[selectedIndex]}
                      panelId={panelId}
                      panelRef={panelRef}
                      onClose={close}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Fragment>
          )
        })}
      </div>
    </section>
  )
}

// ── page ───────────────────────────────────────────────────────────────────

export default function Team() {
  // One panel open at a time across the whole page.
  const [selected, setSelected] = useState(null)

  // 'FILL' is a placeholder role in the data file, not a published title.
  const published = TEAM.filter((m) => m && m.role !== 'FILL')
  const faculty = published.filter((m) => m.tier === 'faculty')
  const core = published.filter((m) => m.tier === 'core')
  const isEmpty = faculty.length === 0 && core.length === 0

  return (
    <main className="mx-auto max-w-5xl px-6 py-24 md:px-10">
      <style>{CARD_CSS}</style>

      <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: colors.muted }}>
        — team
      </p>
      <h1
        className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl"
        style={{ color: colors.ink }}
      >
        Team
      </h1>

      {isEmpty ? (
        <p className="mt-8 font-mono text-[12px]" style={{ color: colors.muted }}>
          Nothing here yet.
        </p>
      ) : (
        <>
          {faculty.length > 0 && (
            <TeamSection
              id="faculty"
              label="Faculty Mentors"
              members={faculty}
              desktopCols={3}
              selected={selected}
              onSelect={setSelected}
            />
          )}
          {core.length > 0 && (
            <TeamSection
              id="core"
              label="Core Team"
              members={core}
              desktopCols={4}
              selected={selected}
              onSelect={setSelected}
            />
          )}
        </>
      )}
    </main>
  )
}
