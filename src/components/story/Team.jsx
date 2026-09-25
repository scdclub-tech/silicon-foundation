import { colors, fonts, withAlpha } from '../../theme'
import { hasText, text } from '../../lib/fill'

// Portraits sit back in grayscale and come forward on hover; the stand-in for
// a portrait that has not arrived yet keeps the same block in the grid.
const TEAM_CSS = `
.team-portrait {
  filter: grayscale(1);
  transition: filter 300ms ease;
}
@media (hover: hover) and (pointer: fine) {
  .team-card:hover .team-portrait { filter: grayscale(0); }
}
@media (prefers-reduced-motion: reduce) {
  .team-portrait { transition: none; }
}
.team-ph {
  background-color: ${colors.placeholderDark};
  background-image: repeating-linear-gradient(
    135deg,
    ${withAlpha(colors.cream, 0.05)} 0 2px,
    transparent 2px 14px
  );
}
`

function Member({ member }) {
  const name = text(member.name)
  const role = text(member.role)
  const photo = hasText(member.photo) ? member.photo : null
  const linkedin = hasText(member.linkedin) ? member.linkedin : null

  return (
    <div className="team-card flex flex-col gap-4">
      {photo ? (
        <img
          src={photo}
          alt={name}
          loading="lazy"
          className="team-portrait h-[320px] w-full rounded-md object-cover md:h-[420px]"
        />
      ) : (
        <div className="team-ph h-[320px] w-full rounded-md md:h-[420px]" aria-hidden="true" />
      )}

      {name && (
        <div style={{ fontFamily: fonts.display, fontSize: 26, fontWeight: 700 }}>{name}</div>
      )}

      {(role || linkedin) && (
        <div
          className="flex flex-wrap gap-4"
          style={{ fontFamily: fonts.mono, fontSize: 13, color: withAlpha(colors.cream, 0.66) }}
        >
          {role && <span>{role}</span>}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colors.accentLight }}
            >
              LinkedIn ↗
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default function Team({ team, kicker }) {
  const members = (team ?? []).filter((m) => m && hasText(m.name))
  if (members.length === 0) return null

  const label = text(kicker)

  return (
    <section style={{ background: colors.ink, color: colors.cream }}>
      <style>{TEAM_CSS}</style>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-6 py-24 md:px-20 md:py-[120px]">
        {label && (
          <div
            className="text-[11px] uppercase tracking-[0.14em] md:text-[13px]"
            style={{ fontFamily: fonts.mono, color: colors.accentLight }}
          >
            {label}
          </div>
        )}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <Member key={m.name} member={m} />
          ))}
        </div>
      </div>
    </section>
  )
}
