// Single source of truth for the Chip War keynote session.
// Every component reads from here. Do not hardcode session copy in components.

export const SESSION_PALETTE = {
  field: '#0D2622', // page background — the die green on the Chip War cover
  surface: '#123029', // input and card background
  dieField: '#0E1A18',
  dieDeep: '#0A1F1B', // die field of the full-page DieBackground
  backing: 'rgba(10, 31, 27, 0.82)', // dieDeep at 0.82, behind text over the die
  gold: '#C9A961', // headings, labels, buttons
  goldBright: '#E3C77E', // user-entered text; plain gold is too dim on green
  teal: '#5FB3A1',
  tealDeep: '#14524A',
  tealBright: '#7FD4C6',
  paper: '#F2F0EA',
  body: '#C3D6CE',
  muted: '#8FA89F',
  faint: '#6E8A80',
  hairline: '#2A5A50',
  error: '#F09A9C', // 7.4:1 on field; the old #E2777A was only 5.4:1
  errorWash: 'rgba(240, 154, 156, 0.10)', // error at 0.10, behind error panels
};

export const chipWarSession = {
  eyebrow: 'KEYNOTE SESSION · SCD',
  title: 'CHIP WAR',
  purpose:
    'How semiconductors built the modern world — and who controls them now',

  date: '2026-10-07',
  dateLabel: '7 October 2026',

  time: '2:30 PM – 4:30 PM',
  durationLabel: '2 hours',

  venue: 'J.C. Bose Hall',

  // Display copy only. The seat cap is enforced by a database trigger, so
  // no seat number is shown or read on the client.
  seatsNote: 'LIMITED SEATS · REGISTER EARLY',

  // Registrations are open from this moment.
  registrationOpensAt: '2026-09-30T00:00:00+05:30',

  // Closed early, on the morning of 6 October, to freeze the attendance
  // list. The authoritative gate is the RLS policy in
  // supabase/migrations/0006_close_session_registrations.sql; this
  // timestamp only switches the UI to the closed state.
  registrationClosesAt: '2026-10-06T09:00:00+05:30',

  // The run of show ends around 4:40 PM, so this allows a little margin.
  sessionEndsAt: '2026-10-07T16:45:00+05:30',

  registrationPath: '/events/chip-war/register',

  // On-duty (OD) section of the registration form. Slot ids match the
  // slotN_* columns on session_registrations.
  od: {
    question: 'Do you need on-duty (OD) for this session?',
    heading: 'On-duty details',
    intro:
      'The session runs 2:30 PM - 4:30 PM. Fill in the classes this affects. Leave a slot blank if you have no class then.',
    slots: [
      { id: 'slot1', label: 'Slot 1', time: '2:20 to 3:10' },
      { id: 'slot2', label: 'Slot 2', time: '3:10 to 4:00' },
      { id: 'slot3', label: 'Slot 3', time: '4:00 to 4:50' },
    ],
  },

  // Copy for each lifecycle state returned by sessionStatus(). `pill` is
  // the homepage panel label and `note` the line beneath it; `heading`
  // and `body` are used on the registration page.
  status: {
    upcoming: {
      pill: 'Registrations open soon',
      heading: 'Registrations open soon',
      body: 'Registrations for this session have not opened yet. Check back shortly.',
    },
    open: {
      pill: 'Register', // the note beneath it is seatsNote
    },
    closed: {
      pill: 'Registrations closed',
      note: 'Wednesday, 7 October · 2:30 PM · J.C. Bose Hall',
      heading: 'Registrations have closed',
      body: 'The session is on Wednesday, 7 October at 2:30 PM in J.C. Bose Hall. Walk-ins cannot be guaranteed a seat.',
    },
    concluded: {
      pill: 'Session concluded',
      note: 'Thank you to everyone who attended.',
      heading: 'This session has concluded',
      body: 'Thank you to everyone who attended.',
    },
    full: {
      eyebrow: 'SESSION FULL',
      heading: 'All seats are taken',
      body: 'All seats for this session have been taken, so we couldn’t register you.',
    },
  },

  attribution: 'Based on Chip War by Chris Miller (2022)',

  speakers: [
    { name: 'Dushyant Singh', role: 'President' },
    { name: 'Abhinav K', role: 'Vice President' },
    { name: 'Tithi Khiya', role: 'Core Member' },
  ],
};

// True while the registration window is open. Derived from the clock on
// every render, so the panel flips state without a redeploy.
export function registrationIsOpen(now = new Date()) {
  const { registrationOpensAt, registrationClosesAt } = chipWarSession;

  if (!registrationOpensAt) return false;

  const opensAt = new Date(registrationOpensAt);
  if (Number.isNaN(opensAt.getTime())) return false;
  if (now < opensAt) return false;

  if (registrationClosesAt) {
    const closesAt = new Date(registrationClosesAt);
    if (!Number.isNaN(closesAt.getTime()) && now >= closesAt) return false;
  }

  return true;
}

// Parses an ISO string to a Date, or null if missing or unparseable.
function parseDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Where the session is in its lifecycle, derived from the clock on render:
//   'upcoming'  -- before registrations open (or no valid open date)
//   'open'      -- between registrationOpensAt and registrationClosesAt
//   'closed'    -- between registrationClosesAt and sessionEndsAt
//   'concluded' -- after sessionEndsAt
export function sessionStatus(now = new Date()) {
  const endsAt = parseDate(chipWarSession.sessionEndsAt);
  if (endsAt && now >= endsAt) return 'concluded';

  const closesAt = parseDate(chipWarSession.registrationClosesAt);
  if (closesAt && now >= closesAt) return 'closed';

  const opensAt = parseDate(chipWarSession.registrationOpensAt);
  if (!opensAt || now < opensAt) return 'upcoming';

  return 'open';
}

export default chipWarSession;
