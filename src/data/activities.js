// Playground activity index. Shared by /playground and the homepage teaser.
//
// Schema per activity:
//   id         string   kebab-case; also the route segment at /playground/<id>
//   icon       string   emoji shown in the card tile
//   title      string
//   desc       string   one or two lines, shown on the card
//   tag        string   'Game' | 'Tool' | 'Simulation' | 'Visualization' | 'Discussion'
//   tagClass   string   CSS class styling the tag chip on /playground
//   bg         string   tile background behind the icon on /playground
//   available  boolean  false renders a non-clickable COMING SOON card

export const activities = [
  { id: 'binary-blitz', icon: '⚡', title: 'Binary Blitz', desc: 'Binary flashes on screen. Convert to decimal before the timer runs out. Gets brutal fast.', tag: 'Game', tagClass: 'tag-game', bg: '#FFF1F2', available: true },
  { id: 'tapeout-calculator', icon: '💰', title: 'Tape-out Cost Calculator', desc: 'Pick a node, set die size, choose volume. Watch NRE and per-unit cost update live.', tag: 'Tool', tagClass: 'tag-tool', bg: '#F0FDF4', available: true },
  { id: 'wafer-defect-map', icon: '🎲', title: 'Wafer Defect Map', desc: 'Sprinkle defects across a silicon wafer and watch yield drop in real time.', tag: 'Simulation', tagClass: 'tag-sim', bg: '#FFF7ED', available: true },
  { id: 'size-of-transistor', icon: '🔬', title: 'The Size of a Transistor', desc: 'Scroll from a human hair down to a 2nm transistor. Feel the scale that makes modern chips extraordinary.', tag: 'Visualization', tagClass: 'tag-viz', bg: '#F0FDFA', available: true },
  { id: 'moores-law', icon: '📈', title: "Moore's Law Timeline", desc: "From Intel's 4004 to Apple's M-series — an animated journey through 50 years of exponential growth.", tag: 'Visualization', tagClass: 'tag-viz', bg: '#EEF2FF', available: false },
  { id: 'verification-puzzle', icon: '🧩', title: 'The Verification Puzzle', desc: 'Probe a black-box chip. Set inputs, observe outputs, figure out what is hiding inside.', tag: 'Game', tagClass: 'tag-game', bg: '#FFFBEB', available: false },
  { id: 'logic-gate-sandbox', icon: '🔧', title: 'Logic Gate Sandbox', desc: 'Drag, drop, and wire logic gates together. Watch truth tables update live.', tag: 'Tool', tagClass: 'tag-tool', bg: '#FAF5FF', available: false },
  { id: 'build-your-fab', icon: '🏭', title: 'Build Your Own Fab', desc: 'Run a chip fabrication plant. Buy equipment, manage yield, survive random events.', tag: 'Simulation', tagClass: 'tag-sim', bg: '#EFF6FF', available: false },
  { id: 'journey-through-chip', icon: '🌀', title: 'Journey Through a Chip', desc: 'Zoom from a full 300mm wafer into a single atom-thin gate oxide. Like Google Maps for silicon.', tag: 'Visualization', tagClass: 'tag-viz', bg: '#FDF2F8', available: false },
  { id: 'hot-takes', icon: '🤔', title: 'Hot Takes: VLSI Edition', desc: 'Spicy statements about chip design. Agree or disagree. See how your batch splits.', tag: 'Discussion', tagClass: 'tag-quiz', bg: '#F9FAFB', available: false },
]
