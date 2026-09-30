import { SESSION_PALETTE as C } from '../data/chipWarSession';

// Full-bleed die-shot artwork, fixed behind the page. Purely decorative and
// static: one inline SVG, no raster assets, no animation. Anything readable
// placed over it needs its own C.backing, because the texture is busy.

const DIE = { x: 60, y: 60, w: 1480, h: 880 };

// Floorplan, deliberately asymmetric. `fill` names a pattern below;
// `line` is the outline colour.
const BLOCKS = [
  // Memory arrays down the left.
  { x: 130, y: 130, w: 300, h: 250, fill: 'sram', line: 'gold', o: 0.6 },
  { x: 130, y: 400, w: 300, h: 170, fill: 'sram2', line: 'teal', o: 0.6 },
  { x: 130, y: 590, w: 190, h: 280, fill: 'sram', line: 'gold', o: 0.5 },
  { x: 335, y: 590, w: 95, h: 280, fill: 'mesh', line: 'teal', o: 0.55 },

  // Four-core logic cluster (its container is drawn separately).
  { x: 480, y: 150, w: 250, h: 140, fill: 'logic', line: 'gold', o: 0.6 },
  { x: 745, y: 150, w: 255, h: 140, fill: 'logic', line: 'teal', o: 0.55 },
  { x: 480, y: 305, w: 250, h: 135, fill: 'logic', line: 'teal', o: 0.55 },
  { x: 745, y: 305, w: 255, h: 135, fill: 'logic', line: 'gold', o: 0.6 },

  // Mixed blocks, centre.
  { x: 460, y: 490, w: 330, h: 190, fill: 'mesh', line: 'gold', o: 0.6 },
  { x: 810, y: 490, w: 210, h: 120, fill: 'sram2', line: 'teal', o: 0.55 },
  { x: 810, y: 630, w: 210, h: 240, fill: 'logic', line: 'gold', o: 0.5 },
  { x: 460, y: 700, w: 150, h: 170, fill: 'sram', line: 'teal', o: 0.6 },
  { x: 630, y: 700, w: 160, h: 170, fill: 'logic', line: 'teal', o: 0.5 },

  // Mixed blocks, right.
  { x: 1050, y: 130, w: 260, h: 200, fill: 'sram2', line: 'gold', o: 0.6 },
  { x: 1050, y: 350, w: 260, h: 120, fill: 'logic', line: 'teal', o: 0.55 },
  { x: 1050, y: 490, w: 150, h: 380, fill: 'sram', line: 'gold', o: 0.5 },
  { x: 1215, y: 490, w: 95, h: 250, fill: 'mesh', line: 'teal', o: 0.6 },
  { x: 1215, y: 760, w: 95, h: 110, fill: 'logic', line: 'gold', o: 0.55 },
];

const CORE_CLUSTER = { x: 460, y: 130, w: 560, h: 330 };

const IO = { x: 1340, y: 130, w: 130, h: 740 };
const IO_STRAPS = 19;

const POWER_V = [
  { x: 380, w: 2.4, o: 0.25 },
  { x: 890, w: 2.6, o: 0.22 },
  { x: 1180, w: 2.2, o: 0.28 },
];
const POWER_H = [
  { y: 300, w: 2.2, o: 0.26 },
  { y: 640, w: 2.6, o: 0.24 },
];

const P = 'diebg-'; // id prefix, so defs never collide with other SVGs

export default function DieBackground() {
  const inner = { x: 100, y: 100, x2: 1500, y2: 900 };

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    >
      <defs>
        <clipPath id={`${P}die`}>
          <rect x={DIE.x} y={DIE.y} width={DIE.w} height={DIE.h} rx="18" />
        </clipPath>

        <pattern id={`${P}sram`} width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="1.1" height="3" fill={C.gold} opacity="0.55" />
        </pattern>

        <pattern
          id={`${P}sram2`}
          width="3"
          height="3"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(90)"
        >
          <rect width="1.1" height="3" fill={C.teal} opacity="0.5" />
        </pattern>

        <pattern id={`${P}logic`} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect x="1" y="1" width="3" height="1.2" fill={C.gold} opacity="0.45" />
          <rect x="4.5" y="3.6" width="2.5" height="1.2" fill={C.goldBright} opacity="0.35" />
          <rect x="2" y="6" width="3.5" height="1.2" fill={C.teal} opacity="0.3" />
        </pattern>

        <pattern id={`${P}mesh`} width="6" height="6" patternUnits="userSpaceOnUse">
          <path
            d="M0 0L6 6M6 0L0 6"
            stroke={C.gold}
            strokeWidth="0.7"
            opacity="0.4"
          />
        </pattern>

        <radialGradient id={`${P}sheen`} cx="28%" cy="18%" r="85%">
          <stop offset="0" stopColor={C.goldBright} stopOpacity="0.22" />
          <stop offset="0.5" stopColor={C.teal} stopOpacity="0.07" />
          <stop offset="1" stopColor="black" stopOpacity="0.35" />
        </radialGradient>
      </defs>

      <rect width="1600" height="1000" fill={C.field} />

      <g clipPath={`url(#${P}die)`}>
        <rect x={DIE.x} y={DIE.y} width={DIE.w} height={DIE.h} fill={C.dieDeep} />

        <rect
          x={CORE_CLUSTER.x}
          y={CORE_CLUSTER.y}
          width={CORE_CLUSTER.w}
          height={CORE_CLUSTER.h}
          fill="none"
          stroke={C.gold}
          strokeWidth="1.5"
          opacity="0.7"
        />

        {BLOCKS.map((b) => (
          <rect
            key={`${b.x}-${b.y}`}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            fill={`url(#${P}${b.fill})`}
            stroke={C[b.line]}
            strokeOpacity={b.o}
            strokeWidth="1"
          />
        ))}

        <rect
          x={IO.x}
          y={IO.y}
          width={IO.w}
          height={IO.h}
          fill={`url(#${P}sram2)`}
          stroke={C.gold}
          strokeOpacity="0.6"
          strokeWidth="1"
        />
        {Array.from({ length: IO_STRAPS }, (_, i) => {
          const y = IO.y + ((i + 1) * IO.h) / (IO_STRAPS + 1);
          return (
            <line
              key={i}
              x1={IO.x + 8}
              x2={IO.x + IO.w - 8}
              y1={y}
              y2={y}
              stroke={C.gold}
              strokeWidth="3"
              opacity="0.5"
            />
          );
        })}

        {POWER_V.map((s) => (
          <line
            key={s.x}
            x1={s.x}
            x2={s.x}
            y1={inner.y}
            y2={inner.y2}
            stroke={C.goldBright}
            strokeWidth={s.w}
            opacity={s.o}
          />
        ))}
        {POWER_H.map((s) => (
          <line
            key={s.y}
            x1={inner.x}
            x2={inner.x2}
            y1={s.y}
            y2={s.y}
            stroke={C.goldBright}
            strokeWidth={s.w}
            opacity={s.o}
          />
        ))}

        <rect
          x="90"
          y="90"
          width="1420"
          height="820"
          fill="none"
          stroke={C.goldBright}
          strokeWidth="5"
          strokeDasharray="3 9"
          opacity="0.7"
        />

        <rect
          x={DIE.x}
          y={DIE.y}
          width={DIE.w}
          height={DIE.h}
          fill={`url(#${P}sheen)`}
        />
      </g>
    </svg>
  );
}
