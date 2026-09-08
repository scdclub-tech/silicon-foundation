import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DieFloorplan from './DieFloorplan';
import { SESSION_PALETTE as C } from '../data/chipWarSession';
import { APPLICATIONS_OPEN_AT } from '../data/applicationQuestions';

const MONO = "'IBM Plex Mono', monospace";
const HEAD = "'Archivo', sans-serif";
const BODY = "'Newsreader', serif";

const pad = (n) => String(n).padStart(2, '0');

function remaining(target) {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export default function ApplicationsLocked() {
  const reduce = useReducedMotion();
  const target = APPLICATIONS_OPEN_AT
    ? new Date(APPLICATIONS_OPEN_AT).getTime()
    : null;

  const [left, setLeft] = useState(() => (target ? remaining(target) : null));

  useEffect(() => {
    if (!target) return undefined;
    const id = setInterval(() => setLeft(remaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const opensLabel = target
    ? new Date(target).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      })
    : null;

  return (
    <main
      style={{ backgroundColor: C.field }}
      className="flex min-h-screen w-full items-center justify-center px-6 py-16"
    >
      <div className="relative w-full max-w-xl text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="relative w-[260px] opacity-[0.16]">
            <DieFloorplan className="w-full" />
            {!reduce && (
              <motion.div
                style={{
                  background: `linear-gradient(to bottom, transparent, ${C.gold}, transparent)`,
                }}
                className="absolute left-0 h-[2px] w-full"
                initial={{ top: '8%', opacity: 0 }}
                animate={{ top: ['8%', '92%'], opacity: [0, 0.9, 0] }}
                transition={{
                  duration: 3.4,
                  repeat: Infinity,
                  repeatDelay: 1.6,
                  ease: 'linear',
                }}
              />
            )}
          </div>
        </div>

        <div className="relative">
          <p
            style={{ fontFamily: MONO, color: C.teal, letterSpacing: '2.4px' }}
            className="text-[11px]"
          >
            SCD COMMUNITY
          </p>

          <h1
            style={{ fontFamily: HEAD, color: C.gold }}
            className="mt-24 text-3xl font-medium md:text-4xl"
          >
            Applications open soon
          </h1>

          <p
            style={{ fontFamily: BODY, color: C.body }}
            className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed"
          >
            Membership applications have not opened yet.
          </p>

          {left && (
            <div className="mt-24">
              <p
                style={{
                  fontFamily: MONO,
                  color: C.muted,
                  letterSpacing: '1.8px',
                }}
                className="text-[11px]"
              >
                OPENS IN
              </p>
              <p
                style={{
                  fontFamily: MONO,
                  color: C.paper,
                  letterSpacing: '3px',
                }}
                className="mt-3 text-2xl md:text-3xl"
                aria-live="off"
              >
                {`${pad(left.days)} : ${pad(left.hours)} : ${pad(
                  left.minutes
                )} : ${pad(left.seconds)}`}
              </p>
              <p
                style={{
                  fontFamily: MONO,
                  color: '#5A5852',
                  letterSpacing: '7px',
                }}
                className="mt-2 text-[11px]"
              >
                DAYS HRS MIN SEC
              </p>
            </div>
          )}

          {opensLabel && (
            <p
              style={{ fontFamily: BODY, color: C.faint }}
              className="mt-10 text-xs"
            >
              {opensLabel} · announced at the Chip War session
            </p>
          )}

          <Link
            to="/"
            style={{ fontFamily: MONO, color: C.gold, letterSpacing: '1.2px' }}
            className="mt-10 inline-block text-[11.5px] uppercase underline underline-offset-4"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
