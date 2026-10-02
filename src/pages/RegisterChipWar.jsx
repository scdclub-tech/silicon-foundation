import { useState } from 'react';
import { Link } from 'react-router-dom';
// NOTE: adjust this path to match your existing Supabase client module.
import { supabase } from '../lib/supabase';
import DieBackground from '../components/DieBackground';
import chipWarSession, {
  SESSION_PALETTE as C,
  sessionStatus,
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
  needs_od: false,
  slot1_subject: '',
  slot1_code: '',
  slot1_faculty: '',
  slot2_subject: '',
  slot2_code: '',
  slot2_faculty: '',
  slot3_subject: '',
  slot3_code: '',
  slot3_faculty: '',
  advisor_name: '',
  advisor_email: '',
};

const SLOT_FIELDS = [
  ['subject', 'Subject'],
  ['code', 'Subject Code'],
  ['faculty', 'Faculty In-charge'],
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Compared against errors.reg_number to give the duplicate case its own
// summary above the Register button.
const DUPLICATE_REG = 'This registration number is already registered';

// Error keys double as input ids, and EMPTY lists them in page order, so
// the first errored key is the topmost errored field.
function focusFirstError(found) {
  const key = Object.keys(EMPTY).find((k) => found[k]);
  const el = key && document.getElementById(key);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  // preventScroll so focus doesn't cut the smooth scroll short.
  el.focus({ preventScroll: true });
}

// Ties an input to its error message for screen readers.
const errorAria = (errors, id) =>
  errors[id]
    ? { 'aria-invalid': true, 'aria-describedby': `${id}-error` }
    : {};

// Trimmed value, or null when blank, so optional columns never get ''.
const orNull = (str) => str.trim() || null;

function validate(v) {
  const e = {};
  if (!v.full_name.trim()) e.full_name = 'Enter your full name';
  if (!v.reg_number.trim()) e.reg_number = 'Enter your registration number';
  if (!v.email.trim()) e.email = 'Enter your email';
  else if (!EMAIL_RE.test(v.email.trim()))
    e.email = 'Enter a valid email address';
  if (!v.year) e.year = 'Select your year';
  if (!v.department.trim()) e.department = 'Enter your department';
  if (!v.phone.trim()) e.phone = 'Enter your phone number';
  else if (!/^[0-9+\-\s]{7,15}$/.test(v.phone.trim()))
    e.phone = 'Enter a valid phone number';

  // Mirrors session_registrations_od_check: advisor details are required
  // only when OD is requested. Slot fields are always optional.
  if (v.needs_od) {
    if (!v.advisor_name.trim())
      e.advisor_name = "Enter your faculty advisor's name";
    if (!v.advisor_email.trim())
      e.advisor_email = "Enter your faculty advisor's email";
    else if (!EMAIL_RE.test(v.advisor_email.trim()))
      e.advisor_email = 'Enter a valid email address';
  }
  return e;
}

// The wrapper sets --input-border and --input-focus, which the input
// inherits, so an errored field's input is outlined in the error colour.
// Errors are announced through the summary above the Register button, not
// per field; aria-describedby reads each one when its input takes focus.
function Field({ id, label, error, className = 'mb-5', children }) {
  return (
    <div
      className={className}
      style={{
        '--input-border': error ? C.error : C.hairline,
        '--input-focus': error ? C.error : C.gold,
      }}
    >
      <label
        htmlFor={id}
        style={{ fontFamily: MONO, color: error ? C.error : C.muted, letterSpacing: '1.4px' }}
        className="mb-2 block text-[11px] uppercase"
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          style={{ fontFamily: MONO, color: C.error }}
          className="mt-1.5 text-[12px]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// Border, focus and placeholder colours go through CSS variables: an inline
// borderColor would override the focus: class and the focus state would
// never show. The border and focus variables come from Field.
const inputStyle = {
  fontFamily: HEAD,
  // Each input carries its own backing so typed text reads over the die.
  backgroundColor: C.backing,
  color: C.goldBright,
  '--input-placeholder': C.muted,
};
// Native dropdown lists ignore the select's background on some platforms.
const optionStyle = { backgroundColor: C.surface, color: C.goldBright };

const inputCls =
  'w-full rounded-md border border-[color:var(--input-border)] px-3.5 py-2.5 text-[15px] outline-none focus:border-[color:var(--input-focus)] placeholder:text-[color:var(--input-placeholder)]';

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

function StatusPanel({ eyebrow, heading, body }) {
  return (
    <Shell>
      <p
        style={{ fontFamily: MONO, color: C.teal, letterSpacing: '2.4px' }}
        className="text-[11px]"
      >
        {eyebrow}
      </p>
      <h1
        style={{ fontFamily: HEAD, color: C.gold }}
        className="mt-4 text-4xl font-medium"
      >
        {heading}
      </h1>
      <p
        style={{ fontFamily: BODY, color: C.body }}
        className="mt-4 text-[15px] leading-relaxed"
      >
        {body}
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

// Every state of the page renders through this, so all of them get the die
// artwork. The content sits on a backed panel: the texture behind it is too
// busy for bare text.
function Shell({ children }) {
  return (
    <main
      style={{ backgroundColor: C.field }}
      className="min-h-screen w-full px-4 py-10 sm:px-6 md:px-12 md:py-16"
    >
      <DieBackground />
      <div
        style={{ backgroundColor: C.backing, borderColor: C.hairline }}
        className="relative z-10 mx-auto max-w-lg rounded-xl border px-4 py-8 sm:px-10 sm:py-12"
      >
        {children}
      </div>
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
  const [full, setFull] = useState(false);

  if (full) {
    const copy = s.status.full;
    return (
      <StatusPanel eyebrow={copy.eyebrow} heading={copy.heading} body={copy.body} />
    );
  }

  if (done) {
    return (
      <StatusPanel
        eyebrow="REGISTRATION CONFIRMED"
        heading={<>You&rsquo;re registered</>}
        body={
          <>
            We&rsquo;ll see you at the session. Please arrive a few minutes
            early for seating.
          </>
        }
      />
    );
  }

  const status = sessionStatus();

  // Direct navigation outside the registration window lands here. The RLS
  // policy on session_registrations is the real gate; this is only UI.
  if (status !== 'open') {
    const copy = s.status[status];
    return (
      <StatusPanel eyebrow={s.eyebrow} heading={copy.heading} body={copy.body} />
    );
  }

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((x) => (x[k] ? { ...x, [k]: undefined } : x));
    if (formError) setFormError('');
  };

  // Switching OD off keeps anything typed (in case it is switched back on)
  // but clears the advisor errors, which no longer apply.
  const setNeedsOd = (needs) => {
    setValues((v) => ({ ...v, needs_od: needs }));
    if (!needs)
      setErrors((x) => ({ ...x, advisor_name: undefined, advisor_email: undefined }));
    if (formError) setFormError('');
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const duplicate = errors.reg_number === DUPLICATE_REG;

  async function handleSubmit() {
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      focusFirstError(found);
      return;
    }

    setSubmitting(true);
    setFormError('');

    // OD columns are only sent when OD is requested; otherwise all null.
    const od = values.needs_od;
    const odText = (k) => (od ? orNull(values[k]) : null);

    const { error } = await supabase.from('session_registrations').insert({
      full_name: values.full_name.trim(),
      reg_number: values.reg_number.trim().toUpperCase(),
      email: values.email.trim().toLowerCase(),
      year: values.year,
      department: values.department.trim(),
      phone: values.phone.trim(),
      needs_od: od,
      slot1_subject: odText('slot1_subject'),
      slot1_code: odText('slot1_code'),
      slot1_faculty: odText('slot1_faculty'),
      slot2_subject: odText('slot2_subject'),
      slot2_code: odText('slot2_code'),
      slot2_faculty: odText('slot2_faculty'),
      slot3_subject: odText('slot3_subject'),
      slot3_code: odText('slot3_code'),
      slot3_faculty: odText('slot3_faculty'),
      advisor_name: odText('advisor_name'),
      advisor_email: od ? orNull(values.advisor_email.toLowerCase()) : null,
    });

    setSubmitting(false);

    if (error) {
      // Raised by the database once every seat is taken.
      if (error.message?.includes('SESSION_FULL')) {
        setFull(true);
      } else if (error.message?.includes('session_registrations_od_check')) {
        // The database insists on advisor details when OD is requested.
        const odErrors = {
          advisor_name: "Your faculty advisor's name is required for OD",
          advisor_email: "Your faculty advisor's email is required for OD",
        };
        setErrors((x) => ({ ...x, ...odErrors }));
        focusFirstError(odErrors);
      } else if (error.code === '23505') {
        // reg_number is the only unique column on session_registrations.
        setErrors((x) => ({ ...x, reg_number: DUPLICATE_REG }));
        focusFirstError({ reg_number: DUPLICATE_REG });
      } else if (error.code === '42501') {
        setFormError('Registrations for this session are closed.');
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

      {s.seatsNote && (
        <p
          style={{ fontFamily: MONO, color: C.muted, letterSpacing: '1.2px' }}
          className="mt-6 text-[11px] uppercase"
        >
          {s.seatsNote}
        </p>
      )}

      <hr style={{ borderColor: C.hairline }} className="my-9 border-t" />

      <Field id="full_name" label="Full name" error={errors.full_name}>
        <input
          id="full_name"
          type="text"
          value={values.full_name}
          onChange={set('full_name')}
          {...errorAria(errors, 'full_name')}
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
          {...errorAria(errors, 'reg_number')}
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
          {...errorAria(errors, 'email')}
          style={inputStyle}
          className={inputCls}
        />
      </Field>

      <Field id="year" label="Year of study" error={errors.year}>
        <select
          id="year"
          value={values.year}
          onChange={set('year')}
          {...errorAria(errors, 'year')}
          style={inputStyle}
          className={inputCls}
        >
          <option value="" style={optionStyle}>
            Select
          </option>
          {YEARS.map((y) => (
            <option key={y} value={y} style={optionStyle}>
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
          {...errorAria(errors, 'department')}
          style={inputStyle}
          className={inputCls}
        />
      </Field>

      <Field id="phone" label="Phone" error={errors.phone}>
        <input
          id="phone"
          type="tel"
          value={values.phone}
          onChange={set('phone')}
          {...errorAria(errors, 'phone')}
          style={inputStyle}
          className={inputCls}
        />
      </Field>

      <fieldset className="mb-5 mt-8">
        <legend
          style={{ fontFamily: MONO, color: C.muted, letterSpacing: '1.4px' }}
          className="mb-3 block text-[11px] uppercase"
        >
          {s.od.question}
        </legend>
        <div className="flex gap-3">
          {[
            [false, 'No'],
            [true, 'Yes'],
          ].map(([val, label]) => {
            const checked = values.needs_od === val;
            return (
              <label
                key={label}
                style={{
                  fontFamily: MONO,
                  letterSpacing: '1.2px',
                  borderColor: checked ? C.gold : C.hairline,
                  backgroundColor: checked ? C.gold : C.backing,
                  color: checked ? C.field : C.goldBright,
                  outlineColor: C.gold,
                }}
                className="cursor-pointer rounded-full border px-6 py-2.5 text-[11.5px] uppercase transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2"
              >
                <input
                  type="radio"
                  name="needs_od"
                  checked={checked}
                  onChange={() => setNeedsOd(val)}
                  className="sr-only"
                />
                {label}
              </label>
            );
          })}
        </div>
      </fieldset>

      {values.needs_od && (
        <section
          aria-labelledby="od-heading"
          style={{ borderColor: C.hairline }}
          className="mb-8 mt-8 border-t pt-8"
        >
          <h2
            id="od-heading"
            style={{ fontFamily: HEAD, color: C.gold }}
            className="text-2xl font-medium"
          >
            {s.od.heading}
          </h2>
          <p
            style={{ fontFamily: HEAD, color: C.muted }}
            className="mt-2 text-[14px] leading-relaxed"
          >
            {s.od.intro}
          </p>

          <div className="mt-6 space-y-4">
            {s.od.slots.map((slot) => (
              <fieldset
                key={slot.id}
                style={{ borderColor: C.hairline }}
                className="rounded-lg border px-3 pb-1 pt-4 sm:px-4"
              >
                <legend
                  style={{ fontFamily: MONO, color: C.gold, letterSpacing: '1.6px' }}
                  className="px-1.5 text-[11px] uppercase"
                >
                  {slot.label}
                  <span style={{ color: C.muted }}> · {slot.time}</span>
                </legend>
                <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-x-3">
                  {SLOT_FIELDS.map(([key, label]) => {
                    const id = `${slot.id}_${key}`;
                    return (
                      <Field
                        key={id}
                        id={id}
                        label={label}
                        className={key === 'subject' ? 'col-span-2 mb-3' : 'mb-3'}
                      >
                        <input
                          id={id}
                          type="text"
                          value={values[id]}
                          onChange={set(id)}
                          style={inputStyle}
                          className={inputCls}
                        />
                      </Field>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="mt-8">
            <Field
              id="advisor_name"
              label="Faculty Advisor Name"
              error={errors.advisor_name}
            >
              <input
                id="advisor_name"
                type="text"
                value={values.advisor_name}
                onChange={set('advisor_name')}
                {...errorAria(errors, 'advisor_name')}
                style={inputStyle}
                className={inputCls}
              />
            </Field>

            <Field
              id="advisor_email"
              label="Faculty Advisor Email"
              error={errors.advisor_email}
            >
              <input
                id="advisor_email"
                type="email"
                value={values.advisor_email}
                onChange={set('advisor_email')}
                {...errorAria(errors, 'advisor_email')}
                style={inputStyle}
                className={inputCls}
              />
            </Field>
          </div>
        </section>
      )}

      {/* Summary at the point of action: the errored field may be screens
          above the button. A duplicate registration number, the most likely
          real failure, gets its own explanation. */}
      {duplicate ? (
        <div
          role="alert"
          style={{ borderColor: C.error, backgroundColor: C.errorWash }}
          className="mb-5 rounded-lg border-2 px-4 py-3.5"
        >
          <p
            style={{ fontFamily: MONO, color: C.error, letterSpacing: '1.4px' }}
            className="text-[12px] font-semibold uppercase"
          >
            Already registered
          </p>
          <p
            style={{ fontFamily: HEAD, color: C.paper }}
            className="mt-1.5 text-[14px] leading-relaxed"
          >
            {values.reg_number.trim().toUpperCase()} is already registered for
            this session. If you registered earlier, you&rsquo;re all set. If
            not, check the registration number for typos.
          </p>
        </div>
      ) : (
        (hasErrors || formError) && (
          <p
            role="alert"
            style={{ fontFamily: MONO, color: C.error, borderColor: C.error }}
            className="mb-5 border-l-2 pl-3 text-[12.5px] leading-relaxed"
          >
            {formError || 'Check the highlighted fields above.'}
          </p>
        )
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