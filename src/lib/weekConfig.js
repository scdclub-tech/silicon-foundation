export const WEEK_CONFIG = {
  1: {
    unlockDate: new Date('2026-06-14'),
    activity: 'foundry-ceo',
    title: 'Foundry CEO',
    emoji: '🏭',
    description: 'You are the CEO of a struggling fab. Make critical decisions under pressure.',
  },
  2: {
    unlockDate: new Date('2026-06-21'),
    activity: 'tapeout-sprint',
    title: 'Tapeout Sprint',
    emoji: '⚙️',
    description: 'Design a real chip from scratch. Every decision has tradeoffs.',
  },
  3: {
    unlockDate: new Date('2026-06-28'),
    activity: 'silicon-detective',
    title: 'Silicon Detective',
    emoji: '🔍',
    description: 'A chip failed in the field. Diagnose the root cause before time runs out.',
  },
}

export function getWeekStatus(weekNum) {
  const config = WEEK_CONFIG[weekNum]
  const now = new Date()
  if (now >= config.unlockDate) return 'unlocked'
  return 'locked'
}

export function getCurrentWeek() {
  let current = 0
  Object.keys(WEEK_CONFIG).forEach(w => {
    if (new Date() >= WEEK_CONFIG[w].unlockDate) current = parseInt(w)
  })
  return current
}