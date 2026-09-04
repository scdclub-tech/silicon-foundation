import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DieFloorplan from './DieFloorplan';
import chipWarSession, {
  SESSION_PALETTE as C,
  registrationIsOpen,
} from '../data/chipWarSession';

const MONO = "'IBM Plex Mono', monospace";
const HEAD = "'Archivo', sans-serif";
const BODY = "'Newsreader', serif";

function Detail({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <div
        style={{ fontFamily: MONO, color: C.muted, letterSpacing: '1.6px' }}
        className="text-[11px] uppercase"
      >
        {label}
      </div>
      <div
        style={{ fontFamily: HEAD, color: C.paper }}
        className="mt-1 text-base"
      >
        {value}
      </div>
    </div>
  );
}

export default function ChipWarAnnouncement() {
  const reduce = useReducedMotion();
  const s = chipWarSession;
  const isOpen = registrationIsOpen();

  const reveal = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.6, ease: 'easeOut' },
      };

  return (
    <section
      aria-labelledby="chipwar-heading"
      style={{ backgroundColor: C.field }}
      className="w-full px-6 py-16 md:px-12 md:py-20"
    >
      <motion.div
        {...reveal}
        className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14"
      >
        <div>
          <p
            style={{ fontFamily: MONO, color: C.teal, letterSpacing: '2.4px' }}
            className="text-[11px]"
          >
            {s.eyebrow}
          </p>

          <h2
            id="chipwar-heading"
            style={{ fontFamily: HEAD, color: C.gold, letterSpacing: '1px' }}
            className="mt-5 text-5xl font-medium md:text-6xl"
          >
            {s.title}
          </h2>

          <p
            style={{ fontFamily: BODY, color: C.body }}
            className="mt-4 max-w-md text-[15px] leading-relaxed"
          >
            {s.purpose}
          </p>

          <hr
            style={{ borderColor: C.hairline }}
            className="my-7 max-w-md border-t"
          />

          <div className="flex flex-wrap gap-x-12 gap-y-5">
            <Detail label="Date" value={s.dateLabel} />
            <Detail label="Time" value={s.time} />
            <Detail label="Venue" value={s.venue} />
          </div>

          <div className="mt-8">
            {isOpen ? (
              <Link
                to={s.registrationPath}
                style={{
                  fontFamily: MONO,
                  backgroundColor: C.gold,
                  color: C.field,
                  letterSpacing: '1.2px',
                }}
                className="inline-flex items-center rounded-full px-6 py-3 text-[11.5px] uppercase transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Register
              </Link>
            ) : (
              <div
                style={{
                  fontFamily: MONO,
                  borderColor: C.gold,
                  color: C.gold,
                  letterSpacing: '1.2px',
                }}
                className="inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-[11.5px] uppercase"
              >
                <span
                  aria-hidden="true"
                  style={{ backgroundColor: C.gold }}
                  className="h-[7px] w-[7px] rounded-full"
                />
                Registrations open soon
              </div>
            )}
          </div>

          <p
            style={{ fontFamily: BODY, color: C.faint }}
            className="mt-9 text-[11px]"
          >
            {s.attribution}
          </p>
        </div>

        <div className="order-first md:order-last">
          <DieFloorplan className="mx-auto w-full max-w-[340px]" />
        </div>
      </motion.div>
    </section>
  );
}