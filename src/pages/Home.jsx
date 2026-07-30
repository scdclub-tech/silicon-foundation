import { Link } from 'react-router-dom'
import { colors, chamfer } from '../theme'
import { EVENTS } from '../data/events'
import { activities } from '../data/activities'

// Shared page gutter. Bands break the full width; their inner content uses this.
const SHELL = 'mx-auto w-full max-w-6xl px-6 md:px-10'

const STATS = [
  { figure: '240+', label: 'Community Members' },
  { figure: '5', label: 'Domains' },
  { figure: '8', label: 'Core Team' },
  { figure: '2', label: 'Process Nodes' },
]

const PILLARS = [
  { label: 'Think', line: 'Start at the physics. Work up.', to: '/domains' },
  { label: 'Learn', line: 'Theory is the floor. Not the ceiling.', to: '/programs' },
  { label: 'Research', line: 'Read the papers. Then beat them.', to: '/domains' },
  { label: 'Build', line: 'From idea to layout to tapeout.', to: '/programs' },
]

const FACILITIES = [
  { label: 'EDA', detail: 'Cadence and Synopsys design suites' },
  { label: 'TCAD', detail: 'Silvaco and Synopsys Sentaurus' },
  { label: 'FPGA', detail: 'AMD Vivado' },
  { label: 'PDK', detail: 'Licensed 90nm and 180nm' },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Parsed by hand rather than via Date: 'YYYY-MM-DD' is read as UTC and would
// render a day early in western timezones.
function formatDate(iso) {
  const [y, m, d] = String(iso || '').split('-').map(Number)
  if (!y || !m || !d) return iso || ''
  return `${d} ${MONTHS[m - 1]} ${y}`
}

// Upcoming first (soonest first), then past, most recent first. At most three.
const FEATURED_EVENTS = [
  ...EVENTS.filter((e) => e.status === 'upcoming').sort((a, b) => a.date.localeCompare(b.date)),
  ...EVENTS.filter((e) => e.status !== 'upcoming').sort((a, b) => b.date.localeCompare(a.date)),
].slice(0, 3)

const FEATURED_ACTIVITIES = activities.filter((a) => a.available).slice(0, 3)

// The light-on-dark counterpart to colors.line, derived from the cream token.
const darkLine = { background: colors.cream, opacity: 0.16 }

function SectionHeading({ children }) {
  return (
    <h2
      className="font-display text-[1.75rem] font-bold leading-[1.1] tracking-tight md:text-[2.5rem]"
      style={{ color: colors.ink }}
    >
      {children}
    </h2>
  )
}

function MoreLink({ to, children }) {
  return (
    <Link
      to={to}
      className="font-mono text-[11px] uppercase tracking-[0.12em] no-underline hover:underline"
      style={{ color: colors.accent }}
    >
      {children}
    </Link>
  )
}

export default function Home() {
  return (
    <main>
      {/* ── 1. Hero ───────────────────────────────────────────────── */}
      <section className={`${SHELL} pb-16 pt-24 md:pb-20 md:pt-32`}>
        <p
          className="font-mono text-[11px] uppercase tracking-[0.18em]"
          style={{ color: colors.muted }}
        >
          Semiconductor Chip Design Club · SRMIST Kattankulathur
        </p>

        <h1
          className="mt-6 max-w-4xl font-display font-extrabold leading-[1.05] tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: colors.ink }}
        >
          Bridging the gap between industry and academia. Step by step.
        </h1>

        <figure
          className="mt-14 max-w-3xl pt-8 md:mt-16 md:pl-10"
          style={{ borderTop: `1px solid ${colors.line}` }}
        >
          <blockquote
            className="prose-serif italic leading-[1.3]"
            style={{ fontSize: 'clamp(1.25rem, 3vw, 2.5rem)', color: colors.muted }}
          >
            “God decided where the oil reserves are, we get to decide where the fabs are.”
          </blockquote>
          <figcaption
            className="mt-5 font-mono text-[11px] tracking-[0.08em]"
            style={{ color: colors.muted }}
          >
            Pat Gelsinger, former CEO, Intel
          </figcaption>
        </figure>
      </section>

      {/* ── 2. Stats strip ────────────────────────────────────────── */}
      <section style={{ background: colors.card }}>
        <div className={`${SHELL} grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-4 md:py-16`}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div
                className="font-mono font-medium leading-none tracking-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: colors.ink }}
              >
                {s.figure}
              </div>
              <div
                className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ color: colors.muted }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. What we do ─────────────────────────────────────────── */}
      <section className={`${SHELL} py-20 md:py-28`}>
        <SectionHeading>What we do</SectionHeading>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <Link
              key={p.label}
              to={p.to}
              className="group relative block p-7 no-underline transition-opacity hover:opacity-90"
              style={{ ...chamfer(14), background: colors.card }}
            >
              <div className="font-display text-lg font-semibold" style={{ color: colors.ink }}>
                {p.label}
              </div>
              <p
                className="prose-serif mt-2 max-w-[22ch] text-[15px] leading-relaxed"
                style={{ color: colors.muted }}
              >
                {p.line}
              </p>
              <span
                aria-hidden="true"
                className="absolute right-6 top-6 text-sm opacity-0 transition-all duration-200 group-hover:translate-x-[2px] group-hover:opacity-100"
                style={{ color: colors.ink }}
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. Facilities ─────────────────────────────────────────── */}
      <section style={{ background: colors.ink }} className="py-24 md:py-36">
        <div className={SHELL}>
          <h2
            className="font-display text-[1.9rem] font-bold leading-[1.1] tracking-tight md:text-[3.25rem]"
            style={{ color: colors.cream }}
          >
            What we have access to
          </h2>

          <dl className="mt-12 md:mt-16">
            {FACILITIES.map((f) => (
              <div key={f.label}>
                <div className="h-px" style={darkLine} />
                <div className="flex flex-col gap-1.5 py-7 md:flex-row md:items-baseline md:gap-12 md:py-8">
                  <dt
                    className="font-mono text-[11px] uppercase tracking-[0.18em] md:w-24 md:shrink-0"
                    style={{ color: colors.cream, opacity: 0.6 }}
                  >
                    {f.label}
                  </dt>
                  <dd
                    className="font-display text-lg leading-snug md:text-2xl"
                    style={{ color: colors.cream }}
                  >
                    {f.detail}
                  </dd>
                </div>
              </div>
            ))}
            <div className="h-px" style={darkLine} />
          </dl>
        </div>
      </section>

      {/* ── 5. Event highlights ───────────────────────────────────── */}
      {FEATURED_EVENTS.length > 0 && (
        <section className={`${SHELL} py-20 md:py-28`}>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <SectionHeading>Recent and upcoming</SectionHeading>
            <MoreLink to="/events">View all events →</MoreLink>
          </div>

          <ul className="mt-10 grid list-none grid-cols-1 gap-10 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_EVENTS.map((e) => (
              <li key={e.id}>
                <Link to={`/events/${e.id}`} className="group block no-underline">
                  <img
                    src={e.images?.[0]}
                    alt={e.title}
                    loading="lazy"
                    className="aspect-video w-full object-cover"
                    style={{ ...chamfer(12), background: colors.card }}
                  />

                  <div
                    className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em]"
                    style={{ color: colors.muted }}
                  >
                    <span>{formatDate(e.date)}</span>
                    <span aria-hidden="true" className="h-3 w-px" style={{ background: colors.line }} />
                    <span>{e.format}</span>
                  </div>

                  {e.registrationOpen && (
                    <span
                      className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.12em]"
                      style={{
                        color: colors.accent,
                        border: `1px solid ${colors.accent}`,
                        padding: '3px 8px',
                      }}
                    >
                      Registrations open
                    </span>
                  )}

                  <h3
                    className="mt-3 font-display text-lg font-semibold leading-snug group-hover:underline"
                    style={{ color: colors.ink }}
                  >
                    {e.title}
                  </h3>

                  <p
                    className="prose-serif mt-2 text-[15px] leading-relaxed"
                    style={{ color: colors.muted }}
                  >
                    {e.blurb}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── 6. Playground teaser ──────────────────────────────────── */}
      {FEATURED_ACTIVITIES.length > 0 && (
        <section className={`${SHELL} pb-20 md:pb-28`}>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <SectionHeading>Playground</SectionHeading>
            <MoreLink to="/playground">Explore all →</MoreLink>
          </div>

          <ul className="mt-10 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_ACTIVITIES.map((a) => (
              <li key={a.id}>
                <Link
                  to={`/playground/${a.id}`}
                  className="group flex h-full items-start gap-4 p-5 no-underline transition-colors"
                  style={{ border: `1px solid ${colors.line}` }}
                >
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center text-lg"
                    style={{ ...chamfer(8), background: colors.card }}
                  >
                    {a.icon}
                  </span>
                  <span className="min-w-0">
                    <span
                      className="block font-display text-[15px] font-semibold leading-snug group-hover:underline"
                      style={{ color: colors.ink }}
                    >
                      {a.title}
                    </span>
                    <span
                      className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.12em]"
                      style={{ color: colors.muted }}
                    >
                      {a.tag}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── 7. Join CTA ───────────────────────────────────────────── */}
      <section style={{ background: colors.card }} className="py-20 text-center md:py-28">
        <div className={SHELL}>
          <h2
            className="font-display text-[1.75rem] font-bold leading-[1.1] tracking-tight md:text-[2.5rem]"
            style={{ color: colors.ink }}
          >
            Build something real
          </h2>

          {/* TODO: content pending */}

          <Link
            to="/join"
            className="mt-8 inline-flex items-center gap-2 rounded-md px-6 py-3 text-[14px] font-semibold no-underline transition-opacity hover:opacity-85"
            style={{ background: colors.ink, color: colors.cream }}
          >
            Join us
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
