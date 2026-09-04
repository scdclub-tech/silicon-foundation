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

  // TODO: FILL — ISO datetime when registrations open, e.g.
  // '2026-09-21T09:00:00+05:30'. While null, the panel shows the
  // "Registrations open soon" state indefinitely.
  registrationOpensAt: null,

  registrationPath: '/events/chip-war/register',

  attribution: 'Based on Chip War by Chris Miller (2022)',

  speakers: [
    { name: 'Dushyant Singh', role: 'President' },
    { name: 'Abhinav K', role: 'Vice President' },
    { name: 'Tithi Khiya', role: 'Core Member' },
  ],
};

// True once registrations are open. Derived from the clock on every render,
// so the panel flips state without a redeploy.
export function registrationIsOpen(now = new Date()) {
  const { registrationOpensAt } = chipWarSession;
  if (!registrationOpensAt) return false;
  const opensAt = new Date(registrationOpensAt);
  if (Number.isNaN(opensAt.getTime())) return false;
  return now >= opensAt;
}

export default chipWarSession;