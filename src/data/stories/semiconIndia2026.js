// src/data/stories/semiconIndia2026.js
//
// All copy for /stories/semicon-india-2026 and the homepage "SCD's First Triumph" panel.
// No copy is hardcoded in components.
// FILL rule: any string that is 'FILL' or contains 'FILL' renders nothing.
// A section whose paragraphs are all FILL does not render. An image whose src is FILL does not render.

export const semiconIndia2026 = {
  slug: 'semicon-india-2026',

  // ── Homepage panel ──────────────────────────────────────────
  panel: {
    label: 'SCD / 01 — Recognition',
    location: 'SEMICON India 2026 · Yashobhoomi, New Delhi',
    titleLines: ["SCD's", 'First', 'Triumph'], // last line gets a blue full stop
    tag: '432 → 288 nm',
    result: '2nd Runner-up · Top 3 in India',
    event: 'Lam Research Student Hackathon · in collaboration with CeNSE, IISc Bengaluru',
    cta: 'Read the story',
    image: {
      src: '/images/stories/semicon-2026/team.jpg',
      alt: 'Dushyant Singh, Dr. Md. Jawaid Alam and Tanishq Sharma at SEMICON India 2026',
      caption: 'Dushyant Singh · Dr. Md. Jawaid Alam · Tanishq Sharma',
    },
  },

  // ── Story hero ──────────────────────────────────────────────
  hero: {
    backLabel: '← SCD',
    backHref: '/',
    index: 'Story 01',
    kicker: "SCD's First Triumph",
    title: 'Top 3 in India',
    subtitle:
      'Dushyant Singh and Tanishq Sharma, mentored by Dr. Md. Jawaid Alam, placed 2nd Runner-up at the Lam Research Student Hackathon, held in collaboration with CeNSE, IISc Bengaluru, at SEMICON India 2026, New Delhi.',
    tag: '2nd Runner-up',
    image: {
      src: '/images/stories/semicon-2026/stage.jpg',
      alt: 'The SCD team on stage at SEMICON India 2026',
    },
    metaLeft: 'Standard Cell Height Reduction Challenge · FinFET 6T SRAM',
    metaRight: 'Yashobhoomi, New Delhi · September 2026',
  },

  stats: [
    { value: 'Top 3', label: 'in India' },
    { value: '432→288', label: 'cell height, nm', accentArrow: true },
    { value: '33.3%', label: 'shorter' },
    { value: '4 of 4', label: 'fins preserved' },
  ],

  // ── Words ───────────────────────────────────────────────────
  mentor: {
    kicker: 'A word from our mentor',
    author: 'Dr. Md. Jawaid Alam',
    role: 'Faculty Mentor, SCD',
    initials: 'JA',
    photo: 'FILL', // '/images/stories/semicon-2026/jawaid.jpg'
    paragraphs: ['FILL'], // Dr. Alam's own words — paste exactly as sent
  },

  teammate: {
    kicker: 'A word from the team',
    author: 'Tanishq Sharma',
    role: 'Member, SCD',
    initials: 'TS',
    photo: 'FILL',
    linkedin: 'https://www.linkedin.com/in/tanishq-sharma-253936319/',
    paragraphs: ['FILL'], // Tanishq's own words — paste exactly as sent
  },

  president: {
    kicker: 'A word from our president',
    heading: 'Five knobs. We used one.',
    author: 'Dushyant Singh',
    role: 'President, SCD',
    initials: 'DS',
    photo: 'FILL',
    // Paragraph objects so the pull quote and margin notes can sit at the right place.
    body: [
      { p: "Every SRAM array on a chip is one small cell, the bitcell, repeated millions of times. Shrink that cell by a nanometre and you shrink the array by a nanometre millions of times over. That is why cell height matters, and it is the problem the Lam Research challenge put in front of us." },
      { p: "The brief was precise. Take a FinFET 6T SRAM cell, make it as short as possible, and keep everything manufacturable through M2. One rule was fixed: lithography resolution stays exactly as it was. No height could be won by assuming the scanner prints better." },
      { p: "The brief also handed us five knobs: the number of fin rows, the cell boundary, power rail placement, contact placement, and M1/M2 routing. At a hackathon the instinct is to start turning them. Before changing anything, we measured." },
      { p: "The cell was 432 nm tall, a figure we confirmed through two independent layers: the N-well stripe pitch and the M1 repeat pitch. It had four fin slots at a 108 nm pitch. Four times 108 is 432. The fins set the height exactly, with zero slack. Routing fit comfortably inside that, and the power rails were not what made the cell tall. And four fins serving six transistors is already the floor for a 6T cell. There was no fin to remove.", note: '432 = 4 × 108' },
      { p: "That one calculation told us four of the five knobs were worth 0 nm. It saved us days of runs that could never have worked." },
      { p: "So the question became: can fin pitch move if lithography can't? It can, because of how the fins are made. They are patterned by SADP, self-aligned double patterning. A mandrel is printed, a 28 nm spacer is deposited on both of its sidewalls, and each mandrel yields two fins. Fin pitch is half the mandrel pitch, and it is set by the spacer, not by what lithography can resolve. The constraint stays untouched.", note: 'fin pitch = mandrel pitch ÷ 2' },
      { p: "We compressed the cell only in the direction the fins stack, so gate length and gate pitch, which run the other way, stayed exactly as they were. One change per run. Every run on a fresh copy of the original. Every run logged, including the failures. After each one we cut the same two cross-sections at locked coordinates and checked gate wrap, source/drain epi merge, STI fill, contact landing, the size threshold and the untouched dimensions." },
      { p: "At a 72 nm fin pitch, everything held. Cell height went from 432 nm to 288 nm: 33.3% shorter, with all four fins still in place and the 1:1:1 fin ratio intact." },
      { p: "We were also wrong, twice, and both times it taught us something. We predicted the gap between neighbouring source/drain epi regions would shrink to 19.2 nm, assuming the epi kept its size. We measured 26.8 nm. Epi grows in facets, and as the space closes the crystal grows smaller and absorbs part of the squeeze. The structure was more forgiving than our model.", note: 'epi gap: predicted 19.2 nm · measured 26.8 nm' },
      { p: "Then we tried to break our own result. At a 60 nm pitch we predicted the gate would pinch off between the fins. It didn't: the gate metal was still there. The cell failed earlier in the flow. The gate spacer, about 16 nm on each sidewall, sealed the 32 nm gap between fins first and trapped voids beneath it. The recess etch could no longer reach silicon, no epi could grow, and there was no source or drain. No device at all.", note: '60 − 28 = 32 nm gap · 2 × 16 nm spacer' },
      { quote: '288 nm is not where we stopped. It is where this process flow stops.' },
      { p: "That failure is why I trust the number. We did not just find a smaller cell. We found the edge, and we can show why it is there." },
      { p: "One limit, stated plainly: the netlist licence was not available to us, so we could not run electrical simulation. We preserved the fin count and ratios that protect read and write margins, but we verified that structurally, not electrically. With more time, that is the first thing we would close." },
      { p: 'FILL' }, // One specific, true line on Tanishq's contribution.
      { p: "The lesson I am taking back to SCD is the one that worked on the bitcell: find the constraint that is actually binding before spending effort anywhere else." },
      { p: "Thank you to Dr. Alam for backing us throughout, to Tanishq for being the teammate this needed, and to Lam Research, CeNSE, IISc Bengaluru and the India Semiconductor Mission for a problem that rewarded thinking over brute force." },
    ],
  },

  // ── The Squeeze (interactive) ───────────────────────────────
  // Drawn at 1 px = 1 nm. Fin width 28 nm. Cell width in the drawing is fixed (Y unchanged).
  squeeze: {
    kicker: 'The squeeze',
    headingLines: ['One lever.', 'Three runs.'],
    runs: [
      {
        id: 'r000', run: 'R000', pitch: 108, pitchLabel: '108 nm pitch', outcome: 'Baseline',
        height: 432, readout: '432 nm', failed: false,
        text: "Four fins at a 108 nm pitch. Four times 108 is 432: the fins set the cell's height exactly, with zero slack. Nothing else in the cell was binding.",
      },
      {
        id: 'r003', run: 'R003', pitch: 72, pitchLabel: '72 nm pitch', outcome: 'All checks pass',
        height: 288, readout: '288 nm', failed: false,
        note: '−144 nm · 4 fins kept · all checks pass',
        text: 'The fins are made by SADP, so their pitch comes from a 28 nm spacer, not from lithography. Mandrel 216 → 144 nm, fin pitch 108 → 72 nm. Every guard check passes.',
      },
      {
        id: 'r004', run: 'R004', pitch: 60, pitchLabel: '60 nm pitch', outcome: 'Fails',
        height: 240, readout: 'No device', failed: true,
        note: "Gate spacer ~16 nm per sidewall fills the 32 nm gap → recess etch can't reach silicon → no epi → no source/drain.",
        text: "One step further, to break it. The gate spacer seals the 32 nm gap between fins, the recess etch can't reach silicon, and no source/drain forms. 288 nm is where the flow stops.",
      },
    ],
  },

  // ── Five knobs ──────────────────────────────────────────────
  knobs: {
    kicker: 'The diagnosis',
    heading: 'Five knobs. One mattered.',
    items: [
      { name: 'Number of fin rows', value: '0 nm', why: '1:1:1 is the floor' },
      { name: 'Power rail placement', value: '0 nm', why: "rails don't set height" },
      { name: 'Contact placement', value: '0 nm', why: 'enabling only' },
      { name: 'M1/M2 routing', value: '0 nm', why: 'routing had slack' },
      { name: 'Cell boundary, via fin pitch', value: '−144 nm', why: 'the only lever', lit: true },
    ],
  },

  // ── Team + closing ──────────────────────────────────────────
  teamKicker: 'The team',

  team: [
    { name: 'Dr. Md. Jawaid Alam', role: 'Faculty Mentor', photo: 'FILL', linkedin: '' },
    { name: 'Dushyant Singh', role: 'President, SCD', photo: 'FILL', linkedin: '' },
    { name: 'Tanishq Sharma', role: 'Member, SCD', photo: 'FILL', linkedin: 'https://www.linkedin.com/in/tanishq-sharma-253936319/' },
  ],

  closing: {
    kicker: 'Next',
    line: 'What comes next begins on 7 October.',
    cta: { label: 'Chip War Keynote Session', href: '/events/chip-war' },
    meta: 'J.C. Bose Hall · 2:30 PM',
  },
}
