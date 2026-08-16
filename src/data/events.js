// ═══════════════════════════════════════════════════════════════════════════
//  SCDC EVENTS DATA — src/data/events.js
//
//  CORE FIELDS
//    id                 string    kebab-case unique identifier
//    title              string
//    date               string    'YYYY-MM-DD'  (start date for multi-day)
//    status             string    'past' | 'upcoming'  — exactly these two
//    domain             string    e.g. 'VLSI', 'Semiconductor Devices'
//    format             string    e.g. 'Workshop', 'Technical Talk', 'Program'
//    blurb              string    one line, shown on the card
//    description        string    full paragraph, shown on the detail view
//    images             string[]  ALWAYS an array. images[0] is the card
//                                 thumbnail; the full array feeds the carousel
//
//  OPTIONAL FIELDS
//    endDate            string    'YYYY-MM-DD' for multi-day events
//    venue              string
//    registrationOpen   boolean   upcoming events only
//    registrationUrl    string
//    linkedinUrl        string    full https:// URL to the SCD post
//    attendees          number
//    attendeeBreakdown  array     [{ label, count }]
//    sessions           array     see shape below
//
//  SESSION SHAPE
//    day          number    1, 2, …
//    time         string    as printed on the programme
//    speaker      string
//    affiliation  string
//    title        string    talk title
//    image        string    portrait path, or '' to fall back to initials
//    imageAspect  string    optional, 'square' (default) | 'wide'. Use 'wide'
//                           for a landscape shot of the speaker presenting —
//                           it renders a 16:9 thumbnail instead of a square
//                           crop, which would cut the subject out.
//    online       boolean   optional, true for remote talks
//
//  RULES
//    • Every object needs a comma after its closing brace.
//    • Apostrophes inside single-quoted strings break the build — use "double".
//    • Image filenames must match disk exactly, extension included.
// ═══════════════════════════════════════════════════════════════════════════

export const EVENTS = [

  {
    id: 'ieee-mini-colloquium',
    title: 'IEEE EDS Mini-Colloquia 2026 — Semiconductor Manufacturing Technologies',
    date: '2026-08-06',
    endDate: '2026-08-07',
    status: 'past',
    registrationOpen: false,
    domain: 'Semiconductor Devices',
    format: 'Colloquium',
    venue: 'J. C. Bose Seminar Hall, Tech Park, SRMIST Kattankulathur',

    blurb:
      'Two days, ten expert sessions, and 88 participants from across India — tracing semiconductor manufacturing from silicon wafer to integrated circuit.',

    description:
      'Organised by the IEEE Electron Devices Society Student Branch Chapter and the Department of ECE, SMT-2026 brought speakers from IIT Gandhinagar, IIT Bombay, IIT Bhubaneswar, the University of Delhi, Sambalpur University, National Tsing Hua University in Taiwan, and from industry \u2014 NanoRel, VVDN Technologies and iVP Semiconductor. Talks ranged from ultra-thin body FETs and terahertz devices to monolithic 3D-IC integration, quantum emitters, chiplet power integrity and silicon photovoltaics. Between sessions, participants competed in Quiz Quest, IQ Clash and the Thinkathon, and Dr. Rupam Goswami of Tezpur University ran the SemE-Hub Challenge. Of the 88 who attended, 31 travelled from outside SRMIST \u2014 including IIITDM Kancheepuram, Anna University, Kongu Engineering College and SRM Tiruchirappalli.',

    linkedinUrl: 'https://lnkd.in/p/gQs9-G7w',

    attendees: 88, // VERIFY: report tables total 88; you quoted 84 — reconcile before publishing
    attendeeBreakdown: [
      { label: 'SRMIST',   count: 57 },
      { label: 'External', count: 31 },
      { label: 'B.Tech',   count: 65 },
      { label: 'M.Tech',   count: 20 },
      { label: 'Ph.D',     count: 2 },
      { label: 'Faculty',  count: 1 },
    ],

    sessions: [
      {
        day: 1,
        time: '10:00 \u2013 10:45',
        speaker: 'Prof. Nihar Ranjan Mohapatra',
        affiliation: 'Dept. of Electrical Engineering, IIT Gandhinagar',
        title: 'Development of ultra-thin body FETs for future-generation CMOS \u2014 progress, limits and the road ahead',
        image: '/images/events/ieee/nihar-talk.jpg',
      },
      {
        day: 1,
        time: '11:30 \u2013 12:15',
        speaker: 'Prof. G. N. Dash',
        affiliation: 'School of Physics, Sambalpur University',
        title: 'Terahertz devices and emerging semiconductor technologies',
        image: '/images/events/ieee/gn-dash-talk.jpg',
      },
      {
        day: 1,
        time: '14:00 \u2013 14:45',
        speaker: 'Prof. Manoj Saxena',
        affiliation: 'Deen Dayal Upadhyaya College, University of Delhi',
        title: 'TFET \u2014 opportunities and challenges for biosensing applications',
        image: '/images/events/ieee/manoj-talk.jpg',
      },
      {
        day: 1,
        time: '15:00 \u2013 15:45',
        speaker: 'Dr. M. K. Radhakrishnan',
        affiliation: 'Founder Director, NanoRel LLP, Singapore / Bengaluru',
        title: 'Technology evolution: FET to AI in 100 years',
        image: '/images/events/ieee/mk-talk.jpg',
      },
      {
        day: 1,
        time: '16:00 \u2013 16:30',
        speaker: 'Prof. K-S Chang-Liao',
        affiliation: 'Dept. of Engineering and System Science, National Tsing Hua University, Taiwan',
        title: 'Vertical integration of CMOS and AOSTFTs for monolithic 3D-IC',
        image: '/images/events/ieee/changliao-talk.jpg',
        online: true,
      },
      {
        day: 2,
        time: '09:15 \u2013 10:00',
        speaker: 'Prof. Rajan Jha',
        affiliation: 'Dept. of Physics, IIT Bhubaneswar',
        title: 'Optical nanofibres: a platform for interfacing quantum emitters',
        image: '/images/events/ieee/rajanjha-talk.jpg',
      },
      {
        day: 2,
        time: '10:00 \u2013 10:45',
        speaker: 'Mr. Yogan Senthilkumar',
        affiliation: 'Chief Technology Officer, iVP Semiconductor, Bengaluru',
        title: 'Power play in the era of high-performance compute and AI',
        image: '/images/events/ieee/yogan-talk.jpg',
      },
      {
        day: 2,
        time: '11:30 \u2013 12:15',
        speaker: 'Dr. Ajit Kumar Panda',
        affiliation: 'Vice President \u2014 Engineering RF, VVDN Technologies, Manesar',
        title: 'Electronics systems: a 5G case study',
        image: '/images/events/ieee/panda-talk.jpg',
      },
      {
        day: 2,
        time: '14:00 \u2013 14:45',
        speaker: 'Prof. Anil Kottantharayil',
        affiliation: 'Dept. of Electrical Engineering, IIT Bombay',
        title: 'Silicon solar cell technology',
        image: '/images/events/ieee/anil-talk.jpg',
      },
      {
        day: 2,
        time: '15:00 \u2013 16:00',
        speaker: 'Dr. Rupam Goswami',
        affiliation: 'Dept. of ECE, Tezpur University \u2014 Founder, SemE-Hub',
        title: 'SemE-Hub Challenge \u2014 Play & Learn session',
        image: '/images/events/ieee/rupam-goswami.png',
      },
    ],

    images: [
      '/images/events/ieee/ieee-group-photo-1.jpeg',
      '/images/events/ieee/ieee-group-photo-2.jpeg',
    ],
  },

  {
    id: 'silicon-foundation-2026',
    title: 'Silicon Foundation: FPGA Design and Simulation using AMD Vivado',
    date: '2026-06-11',
    status: 'past',
    domain: 'VLSI',
    format: 'Program',
    blurb:
      'A three-week structured program on digital design in Verilog, taught on the AMD Vivado toolchain.',
    description:
      'A three-week online program taking selected members from combinational circuits through sequential logic to finite state machines, implemented and verified in Verilog HDL on AMD Vivado. Instructors prepared original teaching material independently, distributed to participants at the close of each week. The programme was supported by a purpose-built web platform carrying interactive activities and three timed weekly challenges, each released after that week\u2019s final session. Certificates of completion were awarded to participants with sustained attendance and engagement.',
    images: [
      '/images/events/silicon-foundation.png',
      '/images/events/silicon-foundation-2.png',
    ],
    attendees: 45,
  },

  {
    id: 'semiconductor-packaging-mems-talk',
    title: 'Tech Talk: Semiconductor Packaging and MEMS',
    date: '2026-04-01',
    status: 'past',
    domain: 'Semiconductor Devices',
    format: 'Technical Talk',
    blurb:
      'Prof. Pradeep Dixit of IIT Bombay on packaging and MEMS \u2014 the part of the industry chip design overshadows.',
    description:
      'Chip design takes most of the attention, but a substantial share of the semiconductor industry lives in packaging. Prof. Pradeep Dixit of IIT Bombay laid out where the field stands today and where it is heading, spotlighting Indian players including Blueberry Semiconductors, RRP Electronics and Kaynes Semicon \u2014 among the country\u2019s first OSAT facilities. He mapped a practical roadmap for students: which skills matter, which sub-domains are worth entering, and how to position early. The session closed on India\u2019s wider semiconductor push and the MeitY CHIPS to Startup programme, followed by an extended Q&A. Hosted by the Department of ECE, SRMIST Kattankulathur in collaboration with the SCD Club.',
    images: [
      '/images/events/electronic-packaging.jpg',
      '/images/events/electronic-packaging-2.jpg',
      '/images/events/electronic-packaging-3.jpg',
    ],
    attendees: 60,
  },

  {
    id: 'cadence-ic-design-training',
    title: 'Full Custom and Semi Custom IC Design using Cadence Design Suite',
    date: '2026-03-12',
    status: 'past',
    domain: 'VLSI',
    format: 'Workshop',
    blurb:
      'Two days taking an op-amp and a UART from design through to GDSII on the Cadence flow.',
    description:
      'A two-day hands-on training program run in association with Entuple Technologies, covering both halves of the IC design flow. Day one worked through a full-custom flow for an operational amplifier, from schematic to GDSII in Cadence Virtuoso. Day two covered a semi-custom flow for a UART, moving from functional verification to GDSII using Cadence Incisive, Genus and Innovus. Held in the EDA Lab and convened by Dr. J Manjula, with Dr. Soumya Ranjan Routray and Dr. Md Jawaid Alam coordinating.',
    images: [
      '/images/events/cadence-virtuoso-workshop.jpg',
      '/images/events/cadence-virtuoso-workshop-2.jpg',
    ],
    attendees: 50,
  },

  // GATE Alumni Talk - uncomment once details are confirmed
  // {
  //   id: 'gate-alumni-talk',
  //   title: 'FILL',
  //   date: 'FILL',                // YYYY-MM-DD
  //   status: 'past',
  //   domain: 'FILL',
  //   format: 'Alumni Talk',
  //   blurb: 'FILL',
  //   description: 'FILL',
  //   images: ['/images/events/gate-alumni-talk.jpg'],
  //   attendees: 20,
  // },

]