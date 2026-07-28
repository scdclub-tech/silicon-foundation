import { colors } from '../theme'
import { EVENTS } from '../data/events'

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
        <ul className="mt-10 space-y-6">
          {EVENTS.map((e) => (
            <li key={e.id} className="border-t pt-6" style={{ borderColor: colors.line }}>
              <div className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: colors.muted }}>
                {e.date}
              </div>
              <div className="mt-1 font-display text-lg font-semibold" style={{ color: colors.ink }}>
                {e.title}
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* TODO: content pending — body copy goes in <p className="prose-serif"> */}
    </main>
  )
}
