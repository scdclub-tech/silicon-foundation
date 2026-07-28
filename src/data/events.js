// Schema per event:
//   id                 string    kebab-case unique identifier
//   title              string
//   date               string    'YYYY-MM-DD'
//   status             string    'past' | 'upcoming'   (exactly these two values)
//   registrationOpen   boolean   optional, upcoming events only
//   registrationUrl    string    optional
//   domain             string    e.g. 'VLSI', 'Semiconductor Devices'
//   format             string    e.g. 'Workshop', 'Technical Talk', 'Program'
//   blurb              string    one line, shown on the card
//   description        string    full paragraph, shown on the detail view
//   images             string[]  ALWAYS an array, even with one item.
//                                images[0] is the card thumbnail;
//                                the full array feeds the detail-view carousel
//   attendees          number    optional

export const EVENTS = [
  {
    id: 'ieee-mini-colloquium',
    title: 'IEEE Mini Colloquium',
    date: '2026-08-06',
    status: 'upcoming',
    registrationOpen: true,
    registrationUrl: 'FILL', // paste the registration link, or delete this line
    domain: 'Semiconductor Devices',
    format: 'Colloquium',
    blurb:
      'Two days on semiconductor manufacturing, from silicon wafer to integrated circuit, with six speakers from academia and industry.',
    description:
      "A two-day colloquium on the latest in semiconductor manufacturing technology, tracing the path from silicon wafer to finished integrated circuit. Speakers include Prof. Anil Kottantharayil (IIT Bombay), Prof. Manoj Saxena (University of Delhi), Prof. G. N. Dash (Sambalpur University), Dr. M. K. Radhakrishnan (Founder, NanoRel LLP), Dr. Ajit Ku. Panda (Vice-President, VVDN Technologies) and Mr. Yogan S (CTO, IVP Semiconductor). Hosted in collaboration with the IEEE SRM Student Branch and the Electron Devices Society, the programme includes technical sessions, competitions and prizes. Registration is \u20B9200 for IEEE members and \u20B9250 for non-members.",
    images: [
      '/images/events/ieee-mini-colloquium.jpg',
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
      '/images/events/silicon-foundation-3.png',
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
      '/images/events/cadence-virtuoso-workshop-3.jpg',
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