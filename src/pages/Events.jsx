import { Link } from 'react-router-dom'
import { colors } from '../theme'
import { EVENTS } from '../data/events'
import EventImage from '../components/EventImage'

export function RegistrationMeta({ event, className = '' }) {
  if (!event.registrationOpen) return null
  const url = event.registrationUrl
  const hasUrl = Boolean(url) && url !== 'FILL'

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span
        className="font-mono text-[10px] uppercase tracking-[0.12em]"
        style={{ color: colors.accent, border: `1px solid ${colors.accent}`, padding: '3px 8px' }}
      >
        Registrations open
      </span>
      {hasUrl && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] no-underline hover:underline"
          style={{ color: colors.accent }}
        >
          Register →
        </a>
      )}
    </div>
  )
}

export default function Events() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24 md:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: colors.muted }}>
        — events
      </p>
      <h1
        className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl"
        style={{ color: colors.ink }}
      >
        Events
      </h1>

      {EVENTS.length === 0 ? (
        <p className="mt-8 font-mono text-[12px]" style={{ color: colors.muted }}>
          Nothing here yet.
        </p>
      ) : (
        <ul className="mt-12 space-y-px" style={{ background: colors.line }}>
          {EVENTS.map((e) => (
            <li key={e.id} style={{ background: colors.cream }}>
              <article className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-[200px_1fr]">
                <Link to={`/events/${e.id}`} className="block no-underline">
                  <EventImage
                    src={e.images?.[0]}
                    alt={e.title}
                    loading="lazy"
                    frameClass="aspect-[4/3]"
                  />
                </Link>

                <div>
                  <div
                    className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em]"
                    style={{ color: colors.muted }}
                  >
                    <span>{e.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{e.domain}</span>
                    <span aria-hidden="true">·</span>
                    <span>{e.format}</span>
                    {typeof e.attendees === 'number' && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{e.attendees} attended</span>
                      </>
                    )}
                  </div>

                  <h2 className="mt-2 font-display text-xl font-semibold leading-snug" style={{ color: colors.ink }}>
                    <Link to={`/events/${e.id}`} className="no-underline hover:underline" style={{ color: colors.ink }}>
                      {e.title}
                    </Link>
                  </h2>

                  <p className="prose-serif mt-3 max-w-2xl text-[15px] leading-relaxed" style={{ color: colors.muted }}>
                    {e.blurb}
                  </p>

                  <RegistrationMeta event={e} className="mt-4" />
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
