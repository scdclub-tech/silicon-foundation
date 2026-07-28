// Schema per event:
//   id          string   kebab-case unique identifier
//   title       string
//   date        string   'YYYY-MM-DD'
//   status      string   'past' | 'upcoming'
//   domain      string   e.g. 'VLSI', 'Semiconductor Devices'
//   format      string   e.g. 'Workshop', 'Technical Talk', 'Program'
//   blurb       string   one line, shown on the card
//   description string   full paragraph, shown on the detail view
//   image       string   '/images/events/<file>.jpg'
//   attendees   number   optional
export const EVENTS = []
