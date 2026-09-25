import { colors, fonts, withAlpha } from '../../theme'
import { hasText, text } from '../../lib/fill'

// The hatched stand-in a portrait falls back to, and the drop cap's float,
// neither of which can be written inline.
const WORDS_CSS = `
.words-ph {
  background-color: ${colors.placeholder};
  background-image: repeating-linear-gradient(
    135deg,
    ${withAlpha(colors.ink, 0.05)} 0 2px,
    transparent 2px 14px
  );
}
.words-dropcap::first-letter {
  float: left;
  font-family: ${fonts.display};
  font-size: 104px;
  line-height: 0.82;
  font-weight: 800;
  margin: 8px 14px 0 0;
  color: ${colors.accent};
}
@media (max-width: 767px) {
  .words-dropcap::first-letter { font-size: 68px; margin: 4px 10px 0 0; }
}
`

// ── author column ──────────────────────────────────────────────────────────

function Author({ words }) {
  const kicker = text(words.kicker)
  const author = text(words.author)
  const role = text(words.role)
  const initials = text(words.initials)
  const photo = hasText(words.photo) ? words.photo : null
  const linkedin = hasText(words.linkedin) ? words.linkedin : null

  return (
    <div className="flex flex-col gap-4 lg:col-span-3">
      {kicker && (
        <div
          className="text-[11px] uppercase tracking-[0.14em] md:text-[13px]"
          style={{ fontFamily: fonts.mono, color: colors.accent }}
        >
          {kicker}
        </div>
      )}

      {(photo || initials) && (
        <div className="mt-3">
          {photo ? (
            <img
              src={photo}
              alt={author || ''}
              className="h-[120px] w-[120px] rounded-full object-cover"
            />
          ) : (
            <div
              className="words-ph flex h-[120px] w-[120px] items-center justify-center rounded-full"
              style={{ fontFamily: fonts.display, fontSize: 36, fontWeight: 700, color: colors.ink }}
              aria-hidden="true"
            >
              {initials}
            </div>
          )}
        </div>
      )}

      {author && (
        <div style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 700 }}>{author}</div>
      )}
      {role && (
        <div style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.mutedDeep }}>{role}</div>
      )}
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.accent }}
        >
          LinkedIn ↗
        </a>
      )}
    </div>
  )
}

// ── body ───────────────────────────────────────────────────────────────────

const BODY_TYPE = { fontSize: 'clamp(18px, 1.6vw, 22px)', lineHeight: 1.6 }

function PullQuote({ quote }) {
  return (
    <blockquote className="my-6 flex flex-col gap-5">
      <div style={{ width: 64, height: 3, background: colors.ink }} aria-hidden="true" />
      <p
        className="prose-serif"
        style={{
          fontStyle: 'italic',
          fontSize: 'clamp(28px, 3.2vw, 44px)',
          lineHeight: 1.22,
        }}
      >
        {quote}
      </p>
    </blockquote>
  )
}

function MarginNote({ n, note }) {
  return (
    <div
      className="lg:col-span-2 lg:col-start-8"
      style={{ fontFamily: fonts.mono, fontSize: 13, lineHeight: 1.55, color: colors.mutedDeep }}
    >
      <span style={{ color: colors.accent }}>{String(n).padStart(2, '0')}</span>
      <br />
      {note}
    </div>
  )
}

/**
 * The president's body: paragraphs, pull quotes and margin notes in one
 * sequence. Each row of the grid holds a paragraph and, where there is one,
 * its note — so a note sits level with the paragraph it belongs to on wide
 * screens and drops beneath it on narrow ones.
 */
function RichBody({ body }) {
  let noteCount = 0
  let seenParagraph = false

  const rows = []
  body.forEach((item, i) => {
    if (!item) return

    if (hasText(item.quote)) {
      rows.push(
        <div key={`q-${i}`} className="lg:col-span-7 lg:col-start-1">
          <PullQuote quote={text(item.quote)} />
        </div>
      )
      return
    }

    if (!hasText(item.p)) return

    const isFirst = !seenParagraph
    seenParagraph = true

    rows.push(
      <p
        key={`p-${i}`}
        className={`prose-serif lg:col-span-7 lg:col-start-1 ${isFirst ? 'words-dropcap' : ''}`}
        style={BODY_TYPE}
      >
        {text(item.p)}
      </p>
    )

    if (hasText(item.note)) {
      noteCount += 1
      rows.push(<MarginNote key={`n-${i}`} n={noteCount} note={text(item.note)} />)
    }
  })

  return <div className="grid grid-cols-1 gap-x-8 gap-y-7 lg:grid-cols-9">{rows}</div>
}

function PlainBody({ paragraphs }) {
  return (
    <div className="flex flex-col gap-7">
      {paragraphs.map((p, i) => (
        <p key={i} className="prose-serif" style={BODY_TYPE}>
          {p}
        </p>
      ))}
    </div>
  )
}

// ── section ────────────────────────────────────────────────────────────────

/**
 * A word from one person. `words.body` takes the president's richer shape
 * (paragraphs, pull quotes, margin notes); `words.paragraphs` is plain prose.
 * A section whose copy is entirely FILL does not render at all.
 */
export default function Words({ words, quoteMark = false, bordered = false }) {
  if (!words) return null

  const body = (words.body ?? []).filter((b) => b && (hasText(b.p) || hasText(b.quote)))
  const paragraphs = (words.paragraphs ?? []).filter(hasText).map(text)
  if (body.length === 0 && paragraphs.length === 0) return null

  const heading = text(words.heading)

  return (
    <section
      className="mx-auto max-w-[1280px] px-6 py-24 md:px-20 md:py-32"
      style={bordered ? { borderTop: `1px solid ${withAlpha(colors.ink, 0.14)}` } : undefined}
    >
      <style>{WORDS_CSS}</style>
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12 lg:items-start">
        <Author words={words} />

        <div className="relative lg:col-span-9">
          {quoteMark && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute select-none"
              style={{
                top: 'clamp(-48px, -5vw, -72px)',
                left: -12,
                fontFamily: fonts.body,
                fontSize: 'clamp(120px, 16vw, 240px)',
                lineHeight: 1,
                color: colors.accent,
                opacity: 0.9,
              }}
            >
              &ldquo;
            </div>
          )}

          <div className={quoteMark ? 'relative pt-16' : 'relative'}>
            {heading && (
              <h2
                className="mb-4"
                style={{
                  fontFamily: fonts.display,
                  fontSize: 'clamp(36px, 4.2vw, 60px)',
                  lineHeight: 1,
                  fontWeight: 800,
                  fontStretch: '112%',
                  letterSpacing: '-0.02em',
                }}
              >
                {heading}
              </h2>
            )}

            {body.length > 0 ? <RichBody body={body} /> : <PlainBody paragraphs={paragraphs} />}
          </div>
        </div>
      </div>
    </section>
  )
}
