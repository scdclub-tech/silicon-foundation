import { useRef, useState } from 'react'
import { colors, radius } from '../theme'
import { supabase } from '../lib/supabase'
import { QUESTIONS, COMMON_QUESTION, YEARS } from '../data/applicationQuestions'

const SHELL = 'mx-auto w-full max-w-3xl px-6 md:px-10'

// Drawn from the club manifesto — do not paraphrase.
const STANCE = [
  ['ASSESSED', 'Every application is read. Most are not accepted.'],
  ['DEPTH', 'We would rather train six students well than certify sixty.'],
  ['OUTPUT', 'Membership expects contribution, not attendance.'],
]

const RESUME_FROM_YEAR = 2
const MAX_RESUME_BYTES = 5 * 1024 * 1024

const BLANK = {
  fullName: '',
  rollNumber: '',
  email: '',
  phone: '',
  department: '',
  programme: '',
  year: '',
  q1: '',
  q2: '',
  q3: '',
  qCommon: '',
}

// Order errors are reported in, so the page can jump to the first one.
const FIELD_ORDER = [
  'fullName', 'rollNumber', 'email', 'phone', 'department', 'programme', 'year',
  'resume', 'q1', 'q2', 'q3', 'qCommon',
]

// Storage keys must not carry slashes or spaces; the `roll-timestamp.pdf`
// shape is preserved.
const storageSafe = (s) => s.trim().replace(/[^A-Za-z0-9._-]+/g, '-')

const isPdf = (file) =>
  file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

/* ── shared bits ──────────────────────────────────────────────────── */

function Hairline({ className = '' }) {
  return <div className={`h-px ${className}`} style={{ background: colors.line }} />
}

function SectionLabel({ index, children }) {
  return (
    <div
      className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.18em]"
      style={{ color: colors.muted }}
    >
      <span>{index}</span>
      <span>{children}</span>
    </div>
  )
}

// Errors stay monochrome — emphasis comes from weight and the marker, not hue.
function FieldError({ id, children }) {
  if (!children) return null
  return (
    <p
      id={id}
      role="alert"
      className="mt-2 font-mono text-[11px] font-medium leading-relaxed"
      style={{ color: colors.ink }}
    >
      <span aria-hidden="true">↳ </span>
      {children}
    </p>
  )
}

// Longhand only: mixing the `border` shorthand with `borderLeftWidth` lets the
// invalid state's thicker left edge survive into the valid state.
function controlStyle({ focused, invalid }) {
  return {
    background: colors.cream,
    color: colors.ink,
    borderStyle: 'solid',
    borderColor: focused || invalid ? colors.ink : colors.line,
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: invalid ? '3px' : '1px',
    borderRadius: radius.sm,
    outline: 'none',
  }
}

// 16px text keeps iOS from zooming the viewport on focus.
const CONTROL_CLASS = 'w-full px-3.5 py-3 text-[16px] font-display'

function TextField({ id, label, value, onChange, error, type = 'text', ...rest }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-mono text-[10px] uppercase tracking-[0.14em]"
        style={{ color: colors.muted }}
      >
        {label}
      </label>
      <input
        id={id}
        data-field={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-2 ${CONTROL_CLASS}`}
        style={controlStyle({ focused, invalid: !!error })}
        {...rest}
      />
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  )
}

function QuestionField({ id, number, question, value, onChange, error }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <div className="flex gap-3 md:gap-4">
        <span
          aria-hidden="true"
          className="mt-[3px] shrink-0 font-mono text-[11px] tracking-[0.12em]"
          style={{ color: colors.muted }}
        >
          {number}
        </span>
        <label htmlFor={id} className="prose-serif text-[17px] leading-relaxed md:text-[18px]" style={{ color: colors.ink }}>
          {question}
        </label>
      </div>

      <textarea
        id={id}
        data-field={id}
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-4 resize-y leading-relaxed ${CONTROL_CLASS}`}
        style={{ ...controlStyle({ focused, invalid: !!error }), minHeight: '9rem' }}
      />

      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4">
        <FieldError id={`${id}-error`}>{error}</FieldError>
        <span
          className="ml-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] tabular-nums"
          style={{ color: colors.muted }}
        >
          {value.length} {value.length === 1 ? 'character' : 'characters'}
        </span>
      </div>
    </div>
  )
}

/* ── page ─────────────────────────────────────────────────────────── */

export default function Join() {
  const [form, setForm] = useState(BLANK)
  const [resume, setResume] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const fileInputRef = useRef(null)
  // Remembers a successful upload so a retry after a failed insert does not
  // leave an orphaned copy in the bucket.
  const uploadedRef = useRef(null)

  const yearNum = Number(form.year) || 0
  const needsResume = yearNum >= RESUME_FROM_YEAR
  const questions = QUESTIONS[yearNum] || []

  const set = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!isPdf(file)) {
      setResume(null)
      setErrors((prev) => ({ ...prev, resume: 'That is not a PDF. Only PDF files are accepted.' }))
    } else if (file.size > MAX_RESUME_BYTES) {
      setResume(null)
      setErrors((prev) => ({
        ...prev,
        resume: `That file is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is 5MB.`,
      }))
    } else {
      setResume(file)
      setErrors((prev) => ({ ...prev, resume: undefined }))
    }
    // Allow re-picking the same file after a rejection.
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function clearFile() {
    setResume(null)
    uploadedRef.current = null
    setErrors((prev) => ({ ...prev, resume: undefined }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function validate() {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Enter your full name.'
    if (!form.rollNumber.trim()) e.rollNumber = 'Enter your roll number.'

    const email = form.email.trim()
    if (!email) e.email = 'Enter your email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'That does not look like an email address.'

    const digits = form.phone.replace(/\D/g, '')
    if (!form.phone.trim()) e.phone = 'Enter a phone number.'
    else if (digits.length < 10 || digits.length > 15) e.phone = 'Enter a phone number with 10 to 15 digits.'

    if (!form.department.trim()) e.department = 'Enter your department.'
    if (form.programme !== 'UG' && form.programme !== 'PG') e.programme = 'Select UG or PG.'
    if (!YEARS.includes(yearNum)) e.year = 'Select your year of study.'

    if (YEARS.includes(yearNum) && yearNum >= RESUME_FROM_YEAR) {
      if (!resume) e.resume = 'Attach your resume as a PDF.'
      else if (!isPdf(resume)) e.resume = 'Only PDF files are accepted.'
      else if (resume.size > MAX_RESUME_BYTES) e.resume = 'The resume must be 5MB or smaller.'
    }

    questions.forEach((_, i) => {
      const key = `q${i + 1}`
      if (!form[key].trim()) e[key] = 'This question needs an answer.'
    })
    if (!form.qCommon.trim()) e.qCommon = 'This question needs an answer.'

    return e
  }

  function jumpTo(found) {
    const first = FIELD_ORDER.find((f) => found[f])
    if (!first || typeof document === 'undefined') return
    const el = document.querySelector(`[data-field="${first}"]`)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const focusable = el.matches('input, select, textarea')
      ? el
      : el.querySelector('input, select, textarea')
    focusable?.focus({ preventScroll: true })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return

    setSubmitError('')
    const found = validate()
    if (Object.keys(found).length > 0) {
      setErrors(found)
      jumpTo(found)
      return
    }

    setErrors({})
    setSubmitting(true)
    try {
      let resumePath = null
      let resumeFilename = null

      // Resume first: never record an application whose resume did not land.
      if (needsResume && resume) {
        if (uploadedRef.current?.file === resume) {
          resumePath = uploadedRef.current.path
        } else {
          const path = `${storageSafe(form.rollNumber)}-${Date.now()}.pdf`
          const { error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(path, resume, { contentType: 'application/pdf', upsert: false })
          if (uploadError) {
            setSubmitError(
              'Your resume could not be uploaded, so nothing was submitted. Check your connection and try again — your answers are still here.',
            )
            return
          }
          uploadedRef.current = { file: resume, path }
          resumePath = path
        }
        resumeFilename = resume.name
      }

      const { error: insertError } = await supabase.from('applications').insert([
        {
          full_name: form.fullName.trim(),
          roll_number: form.rollNumber.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          department: form.department.trim(),
          programme: form.programme,
          year: yearNum,
          resume_path: resumePath,
          resume_filename: resumeFilename,
          q1: form.q1.trim(),
          q2: form.q2.trim(),
          q3: form.q3.trim(),
          q_common: form.qCommon.trim(),
        },
      ])

      if (insertError) {
        setSubmitError(
          'Your application could not be submitted. Nothing was lost — press submit again to retry.',
        )
        return
      }

      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setSubmitError(
        'Something went wrong on the way to our servers. Your answers are still here — try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className={`${SHELL} pb-24 pt-24 md:pb-32 md:pt-28`}>
      {/* ── Stance ─────────────────────────────────────────────────── */}
      <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: colors.muted }}>
        — join us
      </p>

      <h1
        className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl"
        style={{ color: colors.ink }}
      >
        We are not open-entry.
      </h1>

      <p
        className="prose-serif mt-6 max-w-[52ch] text-[18px] leading-relaxed md:text-[20px]"
        style={{ color: colors.muted }}
      >
        Admission is assessed — on profile, on prior work and, most importantly, on intent. We are
        not looking for the largest possible membership. We are looking for students who have
        decided what they want to build.
      </p>

      <dl className="mt-12">
        {STANCE.map(([label, line]) => (
          <div key={label}>
            <Hairline />
            <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
              <dt
                className="font-mono text-[11px] uppercase tracking-[0.18em] sm:w-28 sm:shrink-0"
                style={{ color: colors.ink }}
              >
                {label}
              </dt>
              <dd className="font-mono text-[13px] leading-relaxed" style={{ color: colors.muted }}>
                {line}
              </dd>
            </div>
          </div>
        ))}
        <Hairline />
      </dl>

      {submitted ? (
        <ConfirmationPanel />
      ) : (
        <ApplicationForm
          form={form}
          set={set}
          errors={errors}
          questions={questions}
          yearNum={yearNum}
          needsResume={needsResume}
          resume={resume}
          fileInputRef={fileInputRef}
          onFile={handleFile}
          onClearFile={clearFile}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitError={submitError}
        />
      )}
    </main>
  )
}

function ResumeSection({ resume, error, fileInputRef, onFile, onClear }) {
  return (
    <section data-field="resume">
      <SectionLabel index="02">Resume</SectionLabel>
      <p className="prose-serif mt-4 max-w-[52ch] text-[16px] leading-relaxed" style={{ color: colors.muted }}>
        PDF only, up to 5MB.
      </p>

      <input
        ref={fileInputRef}
        id="resume"
        type="file"
        accept="application/pdf,.pdf"
        onChange={onFile}
        className="sr-only"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? 'resume-error' : undefined}
      />

      {resume ? (
        <div
          className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3"
          style={{ background: colors.card, borderRadius: radius.sm }}
        >
          <span className="min-w-0 flex-1 truncate font-mono text-[12px]" style={{ color: colors.ink }}>
            {resume.name}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] tabular-nums" style={{ color: colors.muted }}>
            {(resume.size / 1024 / 1024).toFixed(2)} MB
          </span>
          <button
            type="button"
            onClick={onClear}
            className="font-mono text-[10px] uppercase tracking-[0.14em] underline"
            style={{ background: 'none', border: 'none', color: colors.ink, cursor: 'pointer' }}
          >
            Remove
          </button>
        </div>
      ) : (
        <label
          htmlFor="resume"
          className="mt-6 inline-flex cursor-pointer items-center gap-2 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em]"
          style={{
            color: colors.ink,
            border: `1px solid ${error ? colors.ink : colors.line}`,
            borderRadius: radius.sm,
          }}
        >
          <span aria-hidden="true">↑</span> Choose PDF
        </label>
      )}

      <FieldError id="resume-error">{error}</FieldError>
    </section>
  )
}

function QuestionsSection({ form, set, errors, questions, yearNum, index }) {
  return (
    <section>
      <SectionLabel index={index}>Questions</SectionLabel>

      {questions.length === 0 ? (
        <p className="prose-serif mt-6 max-w-[52ch] text-[17px] leading-relaxed" style={{ color: colors.muted }}>
          Select your year of study above and the questions will appear here.
        </p>
      ) : (
        <>
          <p className="prose-serif mt-4 max-w-[52ch] text-[16px] leading-relaxed" style={{ color: colors.muted }}>
            Three questions, for year {yearNum}. They follow from one another — read all three before
            you start writing. Answer in your own words; length is not the point.
          </p>

          <div className="mt-12 flex flex-col gap-14">
            {questions.map((question, i) => (
              <QuestionField
                key={`${yearNum}-${i}`}
                id={`q${i + 1}`}
                number={`0${i + 1}`}
                question={question}
                value={form[`q${i + 1}`]}
                onChange={set(`q${i + 1}`)}
                error={errors[`q${i + 1}`]}
              />
            ))}
          </div>
        </>
      )}

      {/* Asked of everyone, set apart from the year-specific set. */}
      <Hairline className="mt-14" />
      <div className="pt-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: colors.muted }}>
          Asked of every applicant
        </p>
        <div className="mt-6">
          <QuestionField
            id="qCommon"
            number="04"
            question={COMMON_QUESTION}
            value={form.qCommon}
            onChange={set('qCommon')}
            error={errors.qCommon}
          />
        </div>
      </div>
    </section>
  )
}

function ProgrammeField({ value, onChange, error }) {
  return (
    <fieldset data-field="programme" className="border-0 p-0">
      <legend className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: colors.muted }}>
        Programme
      </legend>
      <div className="mt-2 flex gap-3">
        {['UG', 'PG'].map((option) => {
          const active = value === option
          return (
            <label
              key={option}
              className="flex-1 cursor-pointer px-4 py-3 text-center font-mono text-[12px] uppercase tracking-[0.12em] transition-colors"
              style={{
                background: active ? colors.ink : colors.cream,
                color: active ? colors.cream : colors.muted,
                border: `1px solid ${active || error ? colors.ink : colors.line}`,
                borderRadius: radius.sm,
              }}
            >
              <input
                type="radio"
                name="programme"
                value={option}
                checked={active}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              {option}
            </label>
          )
        })}
      </div>
      <FieldError id="programme-error">{error}</FieldError>
    </fieldset>
  )
}

function YearField({ value, onChange, error }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label htmlFor="year" className="block font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: colors.muted }}>
        Year of study
      </label>
      <select
        id="year"
        data-field="year"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? 'year-error' : undefined}
        className={`mt-2 appearance-none ${CONTROL_CLASS}`}
        style={controlStyle({ focused, invalid: !!error })}
      >
        <option value="">Select…</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>
            Year {y}
          </option>
        ))}
      </select>
      <FieldError id="year-error">{error}</FieldError>
    </div>
  )
}

function ApplicationForm({
  form, set, errors, questions, yearNum, needsResume, resume,
  fileInputRef, onFile, onClearFile, onSubmit, submitting, submitError,
}) {
  return (
    <form onSubmit={onSubmit} noValidate className="mt-16 md:mt-20">
      {/* ── 1. Identity ──────────────────────────────────────────── */}
      <section>
        <SectionLabel index="01">Identity</SectionLabel>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <TextField
              id="fullName"
              label="Full name"
              value={form.fullName}
              onChange={set('fullName')}
              error={errors.fullName}
              autoComplete="name"
            />
          </div>
          <TextField
            id="rollNumber"
            label="Roll number"
            value={form.rollNumber}
            onChange={set('rollNumber')}
            error={errors.rollNumber}
          />
          <TextField
            id="department"
            label="Department"
            value={form.department}
            onChange={set('department')}
            error={errors.department}
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={set('email')}
            error={errors.email}
            autoComplete="email"
            inputMode="email"
          />
          <TextField
            id="phone"
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            error={errors.phone}
            autoComplete="tel"
            inputMode="tel"
          />

          <ProgrammeField value={form.programme} onChange={set('programme')} error={errors.programme} />
          <YearField value={form.year} onChange={set('year')} error={errors.year} />
        </div>
      </section>

      {/* ── 2. Resume — second year and above ────────────────────── */}
      {needsResume && (
        <>
          <Hairline className="my-14" />
          <ResumeSection
            resume={resume}
            error={errors.resume}
            fileInputRef={fileInputRef}
            onFile={onFile}
            onClear={onClearFile}
          />
        </>
      )}

      {/* ── 3. Questions ─────────────────────────────────────────── */}
      <Hairline className="my-14" />
      <QuestionsSection
        form={form}
        set={set}
        errors={errors}
        questions={questions}
        yearNum={yearNum}
        index={needsResume ? '03' : '02'}
      />

      <Hairline className="my-14" />

      {submitError && (
        <div
          role="alert"
          className="mb-8 px-5 py-4"
          style={{ background: colors.card, borderLeft: `3px solid ${colors.ink}` }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: colors.muted }}>
            Not submitted
          </p>
          <p className="mt-2 font-display text-[15px] leading-relaxed" style={{ color: colors.ink }}>
            {submitError}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-md px-7 py-3.5 text-[15px] font-semibold transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-60"
          style={{ background: colors.ink, color: colors.cream, border: 'none' }}
        >
          {submitting ? 'Submitting…' : 'Submit application'}
          {!submitting && <span aria-hidden="true">→</span>}
        </button>

        <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: colors.muted }}>
          {submitting ? 'Do not close this tab' : 'One submission per applicant'}
        </p>
      </div>
    </form>
  )
}

function ConfirmationPanel() {
  return (
    <section className="mt-16 md:mt-20" aria-live="polite">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: colors.muted }}>
        Status — received
      </p>
      <h2
        className="mt-4 font-display text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl"
        style={{ color: colors.ink }}
      >
        Your application has been received.
      </h2>
      <p
        className="prose-serif mt-5 max-w-[52ch] text-[18px] leading-relaxed"
        style={{ color: colors.muted }}
      >
        Every application is read. You will hear back either way.
      </p>
    </section>
  )
}
