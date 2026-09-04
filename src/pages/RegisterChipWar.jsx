import { useState } from 'react';
import { Link } from 'react-router-dom';
// NOTE: adjust this path to match your existing Supabase client module.
import { supabase } from '../lib/supabase';
import chipWarSession, {
  SESSION_PALETTE as C,
  registrationIsOpen,
} from '../data/chipWarSession';

const MONO = "'IBM Plex Mono', monospace";
const HEAD = "'Archivo', sans-serif";
const BODY = "'Newsreader', serif";

const YEARS = ['1', '2', '3', '4', '5', 'PG'];

const EMPTY = {
  full_name: '',
  reg_number: '',
  email: '',
  year: '',
  department: '',
  phone: '',
};

function validate(v) {
  const e = {};
  if (!v.full_name.trim()) e.full_name = 'Enter your full name';
  if (!v.reg_number.trim()) e.reg_number = 'Enter your registration number';
  if (!v.email.trim()) e.email = 'Enter your email';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    e.email = 'Enter a valid email address';
  if (!v.year) e.year = 'Select your year';
  if (!v.department.trim()) e.department = 'Enter your department';
  if (v.phone.trim() && !/^[0-9+\-\s]{7,15}$/.test(v.phone.trim()))
    e.phone = 'Enter a valid phone number';
  return e;
}

function Field({ id, label, error, children }) {
  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        style={{ fontFamily: MONO, color: C.muted, letterSpacing: '1.4px' }}
        className="mb-2 block text-[11px] uppercase"
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          style={{ fontFamily: MONO, color: '#E2777A' }}
          className="mt-1.5 text-[11px]"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

const inputStyle = {
  fontFamily: HEAD,
  backgroundColor: 'transparent',
  borderColor: C.hairline,
  color: C.paper,
};
const inputCls =
  'w-full rounded-md border px-3.5 py-2.5 text-[15px] outline-none focus:border-[#C9A961]';

function SessionFacts() {
  const s = chipWarSession;
  return (
    <dl className="flex flex-wrap gap-x-10 gap-y-4">
      {[
        ['Date', s.dateLabel],
        ['Time', s.time],
        ['Venue', s.venue],
      ]
        .filter(([, val]) => val)
        .map(([k, val]) => (
          <div key={k}>
            <dt
              style={{ fontFamily: MONO, color: C.muted, letterSpacing: '1.4px' }}
              className="text-[11px] uppercase"
            >
              {k}
            </dt>
            <dd
              style={{ fontFamily: HEAD, color: C.paper }}
              className="mt-1 text-base"
            >
              {val}
            </dd>
          </div>
        ))}
    </dl>
  );
}

function Shell({ children }) {
  return (
    <main
      style={{ backgroundColor: C.field }}
      className="min-h-screen w-full px-6 py-16 md:px-12"
    >
      <div className="mx-auto max-w-lg">{children}</div>
    </main>
  );
}

export default function RegisterChipWar() {
  const s = chipWarSession;
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [done, setDone] = useState(false);

  // Direct navigation before the window opens falls through to this.
  if (!registrationIsOpen()) {
    return (
      <Shell>
        <p
          style={{ fontFamily: MONO, color: C.teal, letterSpacing: '2.4px' }}
          className="text-[11px]"
        >
          {s.eyebrow}
        </p>
        <h1
          style={{ fontFamily: HEAD, color: C.gold }}
          className="mt-4 text-4xl font-medium"
        >
          {s.title}
        </h1>
        <p
          style={{ fontFamily: BODY, color: C.body }}
          className="mt-4 text-[15px] leading-relaxed"
        >
          Registrations for this session have not opened yet. Check back
          shortly.
        </p>
        <div className="mt-8">
          <SessionFacts />
        </div>
        <Link
          to="/"
          style={{ fontFamily: MONO, color: C.gold, letterSpacing: '1.2px' }}
          className="mt-10 inline-block text-[11.5px] uppercase underline underline-offset-4"
        >
          Back to home
        </Link>
      </Shell>
    );
  }

  if (done) {
    return (
      <Shell>
        <p
          style={{ fontFamily: MONO, color: C.teal, letterSpacing: '2.4px' }}
          className="text-[11px]"
        >
          REGISTRATION CONFIRMED
        </p>
        <h1
          style={{ fontFamily: HEAD, color: C.gold }}
          className="mt-4 text-4xl font-medium"
        >
          You&rsquo;re registered
        </h1>
        <p
          style={{ fontFamily: BODY, color: C.body }}
          className="mt-4 text-[15px] leading-relaxed"
        >
          We&rsquo;ll see you at the session. Please arrive a few minutes early
          for seating.
        </p>
        <div className="mt-8">
          <SessionFacts />
        </div>
        <Link
          to="/"
          style={{ fontFamily: MONO, color: C.gold, letterSpacing: '1.2px' }}
          className="mt-10 inline-block text-[11.5px] uppercase underline underline-offset-4"
        >
          Back to home
        </Link>
      </Shell>
    );
  }

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((x) => (x[k] ? { ...x, [k]: undefined } : x));
    if (formError) setFormError('');
  };

  async function handleSubmit() {
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    setFormError('');

    const { error } = await supabase.from('session_registrations').insert({
      full_name: values.full_name.trim(),
      reg_number: values.reg_number.trim().toUpperCase(),
      email: values.email.trim().toLowerCase(),
      year: values.year,
      department: values.department.trim(),
      phone: values.phone.trim() || null,
    });

    setSubmitting(false);

    if (error) {
      if (error.code === '23505') {
        setErrors((x) => ({
          ...x,
          reg_number: 'This registration number is already registered',
        }));
      } else if (error.code === '42501') {
        setFormError('Registrations are not open yet.');
      } else {
        setFormError("Couldn't submit your registration. Try again.");
      }
      return;
    }

    setDone(true);
  }

  return (
    <Shell>
      <p
        style={{ fontFamily: MONO, color: C.teal, letterSpacing: '2.4px' }}
        className="text-[11px]"
      >
        {s.eyebrow}
      </p>
      <h1
        style={{ fontFamily: HEAD, color: C.gold }}
        className="mt-4 text-4xl font-medium"
      >
        {s.title}
      </h1>
      <p
        style={{ fontFamily: BODY, color: C.body }}
        className="mt-3 text-[15px] leading-relaxed"
      >
        {s.purpose}
      </p>

      <div className="mt-7">
        <SessionFacts />
      </div>

      <hr style={{ borderColor: C.hairline }} className="my-9 border-t" />

      <Field id="full_name" label="Full name" error={errors.full_name}>
        <input
          id="full_name"
          type="text"
          value={values.full_name}
          onChange={set('full_name')}
          style={inputStyle}
          className={inputCls}
        />
      </Field>

      <Field
        id="reg_number"
        label="Registration number"
        error={errors.reg_number}
      >
        <input
          id="reg_number"
          type="text"
          value={values.reg_number}
          onChange={set('reg_number')}
          style={inputStyle}
          className={inputCls}
        />
      </Field>

      <Field id="email" label="Email" error={errors.email}>
        <input
          id="email"
          type="email"
          value={values.email}
          onChange={set('email')}
          style={inputStyle}
          className={inputCls}
        />
      </Field>

      <Field id="year" label="Year of study" error={errors.year}>
        <select
          id="year"
          value={values.year}
          onChange={set('year')}
          style={inputStyle}
          className={inputCls}
        >
          <option value="">Select</option>
          {YEARS.map((y) => (
            <option key={y} value={y} style={{ color: '#14140F' }}>
              {y === 'PG' ? 'Postgraduate' : `Year ${y}`}
            </option>
          ))}
        </select>
      </Field>

      <Field id="department" label="Department" error={errors.department}>
        <input
          id="department"
          type="text"
          value={values.department}
          onChange={set('department')}
          style={inputStyle}
          className={inputCls}
        />
      </Field>

      <Field id="phone" label="Phone (optional)" error={errors.phone}>
        <input
          id="phone"
          type="tel"
          value={values.phone}
          onChange={set('phone')}
          style={inputStyle}
          className={inputCls}
        />
      </Field>

      {formError && (
        <p
          style={{ fontFamily: MONO, color: '#E2777A' }}
          className="mb-4 text-[11.5px]"
          role="alert"
        >
          {formError}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          fontFamily: MONO,
          backgroundColor: C.gold,
          color: C.field,
          letterSpacing: '1.2px',
          opacity: submitting ? 0.6 : 1,
        }}
        className="rounded-full px-7 py-3 text-[11.5px] uppercase transition-opacity"
      >
        {submitting ? 'Submitting…' : 'Register'}
      </button>
    </Shell>
  );
}