import { motion, useReducedMotion } from 'framer-motion';
import { SESSION_PALETTE as C } from '../data/chipWarSession';

const BLOCKS = [
  { id: 'mac', x: 420, y: 160, w: 68, h: 90, label: 'MAC', filled: true },
  { id: 'sram', x: 420, y: 260, w: 68, h: 60, label: 'SRAM', filled: false },
  { id: 'ctrl', x: 502, y: 160, w: 83, h: 38, label: 'CTRL', filled: false },
  { id: 'phy', x: 502, y: 208, w: 83, h: 52, label: 'PHY', filled: true },
  { id: 'pll', x: 502, y: 270, w: 83, h: 50, label: 'PLL', filled: false },
];

const DRAW = { duration: 0.8, ease: 'easeInOut' };

export default function DieFloorplan({ className = '' }) {
  const reduce = useReducedMotion();

  // With reduced motion, render the completed state with no animation at all.
  const stat = (delay, extra = {}) =>
    reduce
      ? { initial: false, animate: undefined }
      : { transition: { ...DRAW, delay, ...extra } };

  const drawn = reduce
    ? { pathLength: 1, opacity: 1 }
    : { pathLength: 0, opacity: 1 };

  return (
    <motion.svg
      viewBox="360 100 280 300"
      className={className}
      role="img"
      aria-hidden="true"
      focusable="false"
      initial="rest"
      whileInView="go"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.rect
        x="390"
        y="130"
        width="220"
        height="220"
        rx="6"
        fill={C.dieField}
        stroke={C.gold}
        strokeWidth="0.75"
        initial={drawn}
        variants={{ go: { pathLength: 1 } }}
        {...stat(0)}
      />

      <motion.rect
        x="394"
        y="134"
        width="212"
        height="212"
        fill="none"
        stroke={C.gold}
        strokeWidth="5"
        strokeDasharray="5 13"
        initial={{ opacity: reduce ? 0.85 : 0 }}
        variants={{ go: { opacity: 0.85 } }}
        {...stat(0.55, { duration: 0.5 })}
      />

      <motion.line
        x1="495"
        y1="155"
        x2="495"
        y2="325"
        stroke={C.gold}
        strokeWidth="0.5"
        opacity="0.55"
        initial={drawn}
        variants={{ go: { pathLength: 1 } }}
        {...stat(0.7, { duration: 0.5 })}
      />
      <motion.line
        x1="420"
        y1="225"
        x2="585"
        y2="225"
        stroke={C.gold}
        strokeWidth="0.5"
        opacity="0.3"
        initial={drawn}
        variants={{ go: { pathLength: 1 } }}
        {...stat(0.8, { duration: 0.5 })}
      />

      {BLOCKS.map((b, i) => (
        <motion.rect
          key={b.id}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx="2"
          fill={b.filled ? C.tealDeep : 'none'}
          stroke={b.filled ? C.teal : C.gold}
          strokeWidth="0.75"
          initial={{
            pathLength: reduce ? 1 : 0,
            fillOpacity: reduce ? 1 : 0,
          }}
          variants={{ go: { pathLength: 1, fillOpacity: 1 } }}
          {...stat(0.9 + i * 0.06, { duration: 0.6 })}
        />
      ))}

      {BLOCKS.map((b, i) => (
        <motion.text
          key={`${b.id}-label`}
          x={b.x + b.w / 2}
          y={b.y + b.h / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'IBM Plex Mono', monospace"
          fontSize="11"
          fill={b.filled ? C.tealBright : C.gold}
          initial={{ opacity: reduce ? 1 : 0 }}
          variants={{ go: { opacity: 1 } }}
          {...stat(1.35 + i * 0.04, { duration: 0.4 })}
        >
          {b.label}
        </motion.text>
      ))}

      <motion.text
        x="500"
        y="374"
        textAnchor="middle"
        fontFamily="'IBM Plex Mono', monospace"
        fontSize="11"
        letterSpacing="1.8"
        fill="#5A5852"
        initial={{ opacity: reduce ? 1 : 0 }}
        variants={{ go: { opacity: 1 } }}
        {...stat(1.6, { duration: 0.4 })}
      >
        FLOORPLAN · SCD
      </motion.text>
    </motion.svg>
  );
}