// Schema per member:
//   name      string   full name as it should be published
//   role      string   title
//   tier      string   'faculty' | 'core'
//   image     string   '/images/team/<file>.jpg', or '' to fall back to initials
//   linkedin  string   optional, full URL, or '' to omit the link
//
// Order within the array is the order rendered on the page.
// Faculty mentors will be added above the core team once details are confirmed.

export const TEAM = [
  // ── CORE TEAM ────────────────────────────────────────────────────────────
  {
    name: 'Dushyant Singh',
    role: 'President, Head Creatives',
    focus: 'RTL Design and Fabrication Techniques',
    tier:'core',
    image: '/images/team/dushyant-singh.JPG',
    linkedin: 'www.linkedin.com/in/dushyantsingh11',
    github: 'github.com/DushyantSingh27',
  },
  {
    name: 'Abhinav K',
    role: 'Vice President',
    focus:'Semicondcutor Devices Modelling',
    tier:'core',
    image: '/images/team/abhinav-k.jpeg',
    linkedin: 'www.linkedin.com/in/abhinav-k-167399286/',
  },
  {
    name: 'Khyathi Atmakuru',
    role: 'Vice President',
    focus:'Semicondcutor Devices Modelling',
    tier: 'core',
    image: '/images/team/khyathi-atmakuru.jpg',
    linkedin: 'www.linkedin.com/in/khyathi-atmakuru/',
  },
  {
    name: 'Dannanna Sardhakendra',
    role: 'Treasurer',
    focus: 'Semiconductor Device Modelling',
    tier: 'core',
    image: '',
    linkedin: 'www.linkedin.com/in/dannana-sardhakendra-b26693325/',
  },
  {
    name: 'Sree Mathesh K',
    role: 'Head, VLSI',
    focus:'Semi-Custom Layout Design',
    tier: 'core',
    image: '/images/team/sree-mathesh-k.jpeg',
    linkedin: 'www.linkedin.com/in/sreemathesh/',
  },
  {
    name: 'CB Pranay Charan',
    role: 'FILL', // e.g. 'Head, Semiconductor Devices'
    focus:'Semiconductor Devices',
    tier: 'core',
    image: '/images/team/cb-pranay-charan.jpeg',
    linkedin: 'www.linkedin.com/in/pranay-charan-522698326/',
  },
  {
    name: 'Tithi Khiya',
    role: 'Head, Pr & Media', // e.g. 'Head, Creative'
    focus:'Outreach & Growth',
    tier: 'core',
    image: '/images/team/tithi-khiya.jpeg',
    linkedin: 'www.linkedin.com/in/tithi-khiya-/  ',
  },
  {
    name: 'Ved Manishbhai Naik',
    role: 'Vice Treasurer', // e.g. 'Head, PR & Media'
    focus:'Finance',
    tier: 'core',
    image: '/images/team/ved-manishbhai-naik.jpeg',
    linkedin: 'www.linkedin.com/in/ved-naik-6198a5352/',
  },
]