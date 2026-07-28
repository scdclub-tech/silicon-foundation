import { Link, useParams } from 'react-router-dom'
import { colors } from '../theme'
import { EVENTS } from '../data/events'
import EventCarousel from '../components/EventCarousel'
import { RegistrationMeta } from './Events'

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

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:px-10">
      <Link to="/events" className="font-mono text-[11px] no-underline hover:underline" style={{ color: colors.muted }}>
        ← All events
      </Link>

      <div
        className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em]"
        style={{ color: colors.muted }}
      >
        <span>{event.date}</span>
        <span aria-hidden="true">·</span>
        <span>{event.domain}</span>
        <span aria-hidden="true">·</span>
        <span>{event.format}</span>
        {typeof event.attendees === 'number' && (
          <>
            <span aria-hidden="true">·</span>
            <span>{event.attendees} attended</span>
          </>
        )}
      </div>

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
    </main>
  )
}
