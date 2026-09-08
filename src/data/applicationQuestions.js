// Applications unlock at 4:20 PM on 7 October 2026 — the moment they are
// announced from the stage during the Chip War session.
// This MUST stay identical to both timestamps in
// supabase/migrations/0002_gate_applications.sql.
export const APPLICATIONS_OPEN_AT = '2026-10-07T16:20:00+05:30';

export function applicationsAreOpen(now = new Date()) {
  const opensAt = new Date(APPLICATIONS_OPEN_AT);
  if (Number.isNaN(opensAt.getTime())) return false;
  return now >= opensAt;
}

// Application question sets for /join, keyed by year of study (1–5).
//
// The three questions in a set are chained — each one follows from the answer
// to the one before it — so Join.jsx renders all three at once, never one per
// screen. Edit the copy here; the form reads it and needs no changes.
//
// Schema:
//   QUESTIONS[year]  string[]  exactly three questions, asked in order
//   COMMON_QUESTION  string    asked of every applicant, last, set apart

export const QUESTIONS = {
  1: [
    "Name the specific thing that first made semiconductors interesting to you — a technology, a company, a news story, a video, a problem. One thing, named specifically.",
    "Following from that: what did you do next? Read something, watched something, asked someone, tried to build something — or nothing yet? 'Nothing yet' is an acceptable answer if it's true.",
    "Setting that aside: what's the last thing you taught yourself because you wanted to, not because you were told to? How far did you get?",
  ],
  2: [
    'Which part of the field has pulled at you most — design, verification, devices, fabrication, packaging, something else? Name one and say what made you notice it.',
    'Following from that: what have you actually done about it during your first year here? If the honest answer is very little, say so and say why.',
    'Following from that: name something you started and abandoned. Was it connected to what you named above, or unrelated?',
  ],
  3: [
    "Name a specific thing you want to contribute to the semiconductor field — specific enough that someone could tell whether you'd made progress on it.",
    "Following from that: what have you gone deep on that moves toward it, and what's the honest distance between where you are now and that goal?",
    'Following from that: what would you have to give up to close that distance this year?',
  ],
  4: [
    "Have you decided on core semiconductors as a career, or are you keeping options open? Say which, and if you've decided, name the sub-field.",
    "Following from that: what's the evidence behind that answer — what have you built, studied or pursued that backs it up?",
    'Following from that: you have about a year left here. What would you want finished before you leave, and what would the club get out of it?',
  ],
  5: [
    "What's the problem you want to spend the next several years working on?",
    "Following from that: where does that problem sit right now — who's working on it, what's blocking it, and what's your read on where it goes?",
    "Following from that: you'll be here a short time. What would you want to leave behind that outlasts you — and where do you think this club is currently getting something wrong?",
  ],
}

export const COMMON_QUESTION =
  "What's one thing about the semiconductor industry you think most people get wrong?"

export const YEARS = Object.keys(QUESTIONS).map(Number)
