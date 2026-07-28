import { colors } from '../theme'
import { TEAM } from '../data/team'

export default function Team() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24 md:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: colors.muted }}>
        — team
      </p>
      <h1
        className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl"
        style={{ color: colors.ink }}
      >
        Team
      </h1>

      {TEAM.length === 0 ? (
        <p className="mt-8 font-mono text-[12px]" style={{ color: colors.muted }}>
          Nothing here yet.
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {TEAM.map((m) => (
            <li key={m.id} className="border-t pt-4" style={{ borderColor: colors.line }}>
              <div className="font-display text-base font-semibold" style={{ color: colors.ink }}>
                {m.name}
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: colors.muted }}>
                {m.role}
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* TODO: content pending — body copy goes in <p className="prose-serif"> */}
    </main>
  )
}
