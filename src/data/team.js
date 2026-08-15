// ═══════════════════════════════════════════════════════════════════════════
//  SCDC TEAM DATA — src/data/team.js
//
//  FIELDS
//    name      full name, exactly as it should appear publicly
//    role      title within the club, or academic designation for faculty
//    tier      'faculty' | 'core'   — controls which section it renders in
//    focus     one line: what they work on. '' to omit.
//    since     year joined, as a string. '' to omit.
//    image     '/images/team/<file>.<ext>'  or  ''  for initials fallback
//    linkedin  FULL URL starting with https://   or '' to omit
//    github    FULL URL starting with https://   or '' to omit
//    profile   institutional faculty profile URL, https://, or '' to omit
//
//  RULES
//    • Every object needs all nine fields. Use '' for anything absent.
//    • URLs MUST start with https:// or the link resolves as a relative path
//      and 404s on the live site.
//    • Order in the array = order rendered on the page.
//    • Photo filenames must match the `image` path exactly, extension included.
// ═══════════════════════════════════════════════════════════════════════════

export const TEAM = [

  // ── FACULTY MENTORS ──────────────────────────────────────────────────────
  {
    name: 'Dr. Md. Jawaid Alam',
    role: 'Assistant Professor, Department of ECE',
    tier: 'faculty',
    focus: 'Semiconductor and MEMS fabrication processes, cleanroom technology, and device characterisation.',
    since: '2025',
    image: '/images/team/md-jawaid-alam.png',
    linkedin: 'https://www.linkedin.com/in/dr-md-jawaid-alam-152aa27/',
    github: '',
    profile: 'https://www.srmist.edu.in/faculty/dr-md-jawaid-alam/',
  },
  {
    name: 'Dr. Soumyaranjan Routray',
    role: 'Research Assistant Professor, Department of ECE',
    tier: 'faculty',
    focus: 'Semiconductor devices, reliability and failure analysis, IC design, neuromorphic computing, qubit design.',
    since: '2025',
    image: '/images/team/soumyaranjan-routray.png',
    linkedin: 'https://www.linkedin.com/in/dr-soumya-r-routray-5bbb7066/',
    github: '',
    profile: 'https://www.srmist.edu.in/faculty/dr-soumyaranjan-routray/',
  },
  {
    name: 'Dr. J Manjula',
    role: 'Associate Professor, Department of ECE',
    tier: 'faculty',
    focus: 'VLSI design and RF circuit design.',
    since: '2025',
    image: '/images/team/j-manjula.png',
    linkedin: 'https://www.linkedin.com/in/dr-j-manjula-222a83126/',
    github: '',
    profile: 'https://www.srmist.edu.in/faculty/dr-j-manjula/',
  },

  // ── CORE TEAM ────────────────────────────────────────────────────────────
  {
    name: 'Dushyant Singh',
    role: 'President, Head Creatives',
    tier: 'core',
    focus: 'RTL design and fabrication techniques',
    since: '2026',
    image: '/images/team/dushyant-singh.jpg',
    linkedin: 'https://www.linkedin.com/in/dushyantsingh11',
    github: 'https://github.com/DushyantSingh27',
    profile: '',
  },
  {
    name: 'Abhinav K',
    role: 'Vice President',
    tier: 'core',
    focus: 'Semiconductor device modelling',
    since: '2025',
    image: '/images/team/abhinav-k.jpeg',
    linkedin: 'https://www.linkedin.com/in/abhinav-k-167399286/',
    github: '',
    profile: '',
  },
  {
    name: 'Khyathi Atmakuru',
    role: 'Vice President',
    tier: 'core',
    focus: 'Semiconductor device modelling',
    since: '2025',
    image: '/images/team/khyathi-atmakuru.jpg',
    linkedin: 'https://www.linkedin.com/in/khyathi-atmakuru/',
    github: '',
    profile: '',
  },
  {
    name: 'Dannanna Sardhakendra',
    role: 'Treasurer',
    tier: 'core',
    focus: 'Semiconductor device modelling',
    since: '2025',
    image: '/images/team/dannanna-sardhakendra.jpg',
    linkedin: 'https://www.linkedin.com/in/dannana-sardhakendra-b26693325/',
    github: '',
    profile: '',
  },
  {
    name: 'Sree Mathesh K',
    role: 'Head, VLSI',
    tier: 'core',
    focus: 'Semi-custom layout design',
    since: '2025',
    image: '/images/team/sree-mathesh-k.jpeg',
    linkedin: 'https://www.linkedin.com/in/sreemathesh/',
    github: '',
    profile: '',
  },
  {
    name: 'CB Pranay Charan',
    role: 'Head, Semiconductor Devices', // EDIT: still needs a title
    tier: 'core',
    focus: 'Semiconductor devices',
    since: '2025',
    image: '/images/team/cb-pranay-charan.jpeg',
    linkedin: 'https://www.linkedin.com/in/pranay-charan-522698326/',
    github: '',
    profile: '',
  },
  {
    name: 'Tithi Khiya',
    role: 'Head, PR & Media',
    tier: 'core',
    focus: 'Outreach and growth',
    since: '2026',
    image: '/images/team/tithi-khiya.jpeg',
    linkedin: 'https://www.linkedin.com/in/tithi-khiya-/',
    github: '',
    profile: '',
  },
  {
    name: 'Ved Manishbhai Naik',
    role: 'Vice Treasurer',
    tier: 'core',
    focus: 'Finance',
    since: '2026',
    image: '/images/team/ved-manishbhai-naik.jpeg',
    linkedin: 'https://www.linkedin.com/in/ved-naik-6198a5352/',
    github: '',
    profile: '',
  },

]