import { Link, useParams } from 'react-router-dom'
import { colors } from '../theme'
import { EVENTS } from '../data/events'
import EventCarousel from '../components/EventCarousel'
import Portrait from '../components/Portrait'
import { RegistrationMeta } from './Events'

// ── helpers ────────────────────────────────────────────────────────────────

/** A field counts as present only when it holds non-blank text. */
const has = (v) => typeof v === 'string' && v.trim() !== ''

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** 'YYYY-MM-DD' → { y, m, d }, or null for anything else (including 'FILL'). */
function parseISODate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || '').trim())
  if (!m) return null
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null
  return { y, m: mo, d }
}

const asWords = ({ y, m, d }) => `${d} ${MONTHS[m - 1]} ${y}`

/**
 * '6 August 2026' for a single day, '6–7 August 2026' for a range, widening to
 * '30 July – 2 August 2026' across months and to both years across years.
 *
 * A date the parser does not recognise prints exactly as it was authored, so a
 * placeholder in the data file shows itself rather than a bogus formatted date.
 */
function formatEventDate(start, end) {
  const a = parseISODate(start)
  if (!a) return start
  const b = parseISODate(end)
  if (!b || (b.y === a.y && b.m === a.m && b.d === a.d)) return asWords(a)
  if (a.y === b.y && a.m === b.m) return `${a.d}–${b.d} ${MONTHS[a.m - 1]} ${a.y}`
  if (a.y === b.y) return `${a.d} ${MONTHS[a.m - 1]} – ${b.d} ${MONTHS[b.m - 1]} ${a.y}`
  return `${asWords(a)} – ${asWords(b)}`
}

/**
 * Sessions in authored order, chunked into consecutive runs of the same `day`.
 * Entries with no day number group together and render without a heading, so a
 * single-day programme need not carry `day: 1` on every row.
 */
function groupByDay(sessions) {
  const groups = []
  for (const s of sessions) {
    const day = typeof s.day === 'number' ? s.day : null
    const last = groups[groups.length - 1]
    if (last && last.day === day) last.items.push(s)
    else groups.push({ day, items: [s] })
  }
  return groups
}

// ── section pieces ─────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <h2 className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: colors.muted }}>
      {children}
    </h2>
  )
}

/**
 * Total plus its split. The total comes from `attendees` and is never derived
 * from the rows: the breakdown mixes groupings (institution, degree), so adding
 * the counts up would double-count every head.
 */
function Attendance({ total, breakdown }) {
  return (
    <section className="mt-14">
      <SectionLabel>Attendance</SectionLabel>

      {typeof total === 'number' && (
        <div className="mt-4 flex flex-wrap items-baseline gap-x-3">
          <span className="font-display text-5xl font-bold tabular-nums leading-none" style={{ color: colors.ink }}>
            {total}
          </span>
          <span
            className="font-mono text-[11px] uppercase tracking-[0.14em]"
            style={{ color: colors.muted }}
          >
            attended
          </span>
        </div>
      )}

      <dl className="mt-6 max-w-sm">
        {breakdown.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-6 border-t py-2.5"
            style={{ borderColor: colors.line }}
          >
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: colors.muted }}>
              {row.label}
            </dt>
            <dd className="font-mono text-[13px] tabular-nums" style={{ color: colors.ink }}>
              {row.count}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/**
 * Session artwork comes in two shapes, so the row template is picked per
 * session rather than fixed. Both step down a size at tablet width and go
 * full-bleed above the text once the row stacks, below 640px.
 *
 * The two frames land within a few pixels of each other in height — 120 square
 * against 200×112 wide — so a mixed list keeps a steady rhythm rather than
 * jumping row to row. Class strings are written out in full because Tailwind
 * only sees literals in the source.
 */
const MEDIA = {
  square: {
    columns: 'sm:grid-cols-[96px_1fr] md:grid-cols-[120px_1fr]',
    aspect: '1 / 1',
  },
  wide: {
    columns: 'sm:grid-cols-[160px_1fr] md:grid-cols-[200px_1fr]',
    aspect: '16 / 9',
  },
}

function SessionRow({ session }) {
  // Anything unrecognised — including the field being absent — reads as square.
  const media = MEDIA[session.imageAspect] || MEDIA.square

  return (
    <div className={`grid grid-cols-1 gap-4 py-6 sm:gap-5 ${media.columns}`}>
      {/* The wrapper takes the stretch the grid applies, leaving the frame
          inside free to hold its aspect ratio. Its min-height is the square
          frame's height, so a 16:9 thumbnail — 8px shorter at the same column
          width — reserves the same slot and the two row types line up. */}
      <div className="w-full sm:min-h-[96px] md:min-h-[120px]">
        <Portrait
          src={session.image}
          name={session.speaker}
          size={10}
          fontSize="1.75rem"
          aspect={media.aspect}
          context="events"
        />
      </div>

      <div className="min-w-0">
        {(has(session.time) || session.online) && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {has(session.time) && (
              <span
                className="font-mono text-[11px] uppercase tracking-[0.14em]"
                style={{ color: colors.muted }}
              >
                {session.time}
              </span>
            )}
            {session.online && (
              <span
                className="font-mono text-[9px] uppercase tracking-[0.12em]"
                style={{ color: colors.accent, border: `1px solid ${colors.accent}`, padding: '2px 6px' }}
              >
                Online
              </span>
            )}
          </div>
        )}

        {has(session.speaker) && (
          <div className="mt-1.5 font-display text-[15px] font-semibold leading-snug" style={{ color: colors.ink }}>
            {session.speaker}
          </div>
        )}

        {has(session.affiliation) && (
          <div className="mt-1 text-[13px] leading-snug" style={{ color: colors.muted }}>
            {session.affiliation}
          </div>
        )}

        {has(session.title) && (
          <p className="prose-serif mt-2.5 text-[16px] leading-relaxed" style={{ color: colors.ink }}>
            {session.title}
          </p>
        )}
      </div>
    </div>
  )
}

function Programme({ sessions }) {
  return (
    <section className="mt-14">
      <SectionLabel>Programme</SectionLabel>

      {groupByDay(sessions).map((group, gi) => (
        <div key={group.day ?? `ungrouped-${gi}`} className="mt-8">
          {group.day !== null && (
            <h3
              className="font-display text-[13px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: colors.ink }}
            >
              Day {group.day}
            </h3>
          )}

          {/* hairline rules come from the gap between rows, as on the events index */}
          <ul className="mt-3 space-y-px" style={{ background: colors.line }}>
            {group.items.map((s, i) => (
              <li key={`${s.speaker || 'session'}-${s.time || i}`} style={{ background: colors.cream }}>
                <SessionRow session={s} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}

// ── page ───────────────────────────────────────────────────────────────────

export default function EventDetail() {
  const { id } = useParams()
  const event = EVENTS.find((e) => e.id === id)

  if (!event) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 md:px-10">
        <h1 className="font-display text-2xl font-semibold" style={{ color: colors.ink }}>
          Event not found
        </h1>
        <Link to="/events" className="mt-6 inline-block font-mono text-[12px]" style={{ color: colors.accent }}>
          ← All events
        </Link>
      </main>
    )
  }

  // Every block below is optional in the data file, so each one is filtered to
  // usable entries first and skipped entirely when nothing survives — an event
  // with none of these fields renders exactly as it did before.
  const breakdown = (Array.isArray(event.attendeeBreakdown) ? event.attendeeBreakdown : []).filter(
    (row) => row && has(row.label) && typeof row.count === 'number',
  )
  const sessions = (Array.isArray(event.sessions) ? event.sessions : []).filter(
    (s) => s && (has(s.speaker) || has(s.title)),
  )
  // The breakdown carries the headcount when it is present; showing it in the
  // metadata row as well would print the same figure twice on one page.
  const showInlineAttendees = typeof event.attendees === 'number' && breakdown.length === 0

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:px-10">
      <Link to="/events" className="font-mono text-[11px] no-underline hover:underline" style={{ color: colors.muted }}>
        ← All events
      </Link>

      <div
        className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em]"
        style={{ color: colors.muted }}
      >
        <span>{formatEventDate(event.date, event.endDate)}</span>
        <span aria-hidden="true">·</span>
        <span>{event.domain}</span>
        <span aria-hidden="true">·</span>
        <span>{event.format}</span>
        {showInlineAttendees && (
          <>
            <span aria-hidden="true">·</span>
            <span>{event.attendees} attended</span>
          </>
        )}
      </div>

      {has(event.venue) && (
        <p className="mt-2 font-mono text-[11px] leading-relaxed" style={{ color: colors.muted }}>
          {event.venue}
        </p>
      )}

      <h1
        className="mt-3 font-display text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl"
        style={{ color: colors.ink }}
      >
        {event.title}
      </h1>

      <RegistrationMeta event={event} className="mt-5" />

      <div className="mt-10">
        <EventCarousel images={event.images} alt={event.title} />
      </div>

      <p className="prose-serif mt-10 text-[17px] leading-[1.75]" style={{ color: colors.ink }}>
        {event.description}
      </p>

      {breakdown.length > 0 && <Attendance total={event.attendees} breakdown={breakdown} />}

      {sessions.length > 0 && <Programme sessions={sessions} />}

      {has(event.linkedinUrl) && (
        <p className="mt-14">
          <a
            href={event.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[12px] no-underline hover:underline"
            style={{ color: colors.accent }}
          >
            Read the full write-up on LinkedIn →
          </a>
        </p>
      )}
    </main>
  )
}
