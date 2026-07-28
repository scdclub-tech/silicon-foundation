import { colors } from '../theme'

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24 md:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: colors.muted }}>
        SRM Institute of Science and Technology, Kattankulathur
      </p>
      <h1
        className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl"
        style={{ color: colors.ink }}
      >
        Semiconductor Chip Design Club
      </h1>
      {/* TODO: content pending — body copy goes in <p className="prose-serif"> */}
    </main>
  )
}
