// Single source of truth for the Chip War keynote session.
// Every component reads from here. Do not hardcode session copy in components.

export const SESSION_PALETTE = {
  field: '#0B0B0B',
  dieField: '#0E1A18',
  gold: '#C9A961',
  goldBright: '#E3C77E',
  teal: '#2A9D8F',
  tealDeep: '#14524A',
  tealBright: '#7FD4C6',
  paper: '#F2F0EA',
  body: '#C8C6BE',
  muted: '#7E7C75',
  faint: '#6E6C66',
  hairline: '#3A3833',
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

  seatLimit: 100,

  // Registrations are open from this moment.
  registrationOpensAt: '2026-09-30T00:00:00+05:30',

  // And close when the session begins. Must stay identical to the
  // timestamp in the RLS policy in
  // supabase/migrations/0004_open_registrations_add_od_fields.sql —
  // that policy is the authoritative gate, this is UI convenience.
  registrationClosesAt: '2026-10-07T14:30:00+05:30',

  // When the session finishes. After this the site reports it as concluded.
  sessionEndsAt: '2026-10-07T16:30:00+05:30',

  registrationPath: '/events/chip-war/register',

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
      pill: 'Register',
      note: 'Limited to 100 seats',
    },
    closed: {
      pill: 'Registrations closed',
      note: 'The session is today at 2:30 PM in J.C. Bose Hall.',
      heading: 'Registrations have closed',
      body: 'The session is today at 2:30 PM in J.C. Bose Hall. Walk-ins cannot be guaranteed a seat.',
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
      body: 'All 100 seats for this session have been claimed, so we couldn’t register you.',
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
