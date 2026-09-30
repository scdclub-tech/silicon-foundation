-- Chip War session: open registrations, and add the on-duty (OD) fields.
--
-- Two changes:
--   1. Registrations open now and close automatically when the session
--      starts on 7 October at 2:30 PM IST.
--   2. Columns for the OD details the club needs in order to raise
--      on-duty letters for attendees.

-- ---------------------------------------------------------------------
-- 1. Open registrations
-- ---------------------------------------------------------------------
-- The previous policy held registrations closed until a far-future date.
-- This replaces it with a window that is open NOW and shuts at the
-- moment the session begins, so no one can register mid-session or after.

drop policy if exists session_registrations_insert_when_open
  on public.session_registrations;

create policy session_registrations_insert_when_open
  on public.session_registrations
  for insert
  to anon
  with check (now() < timestamptz '2026-10-07 14:30:00+05:30');

-- ---------------------------------------------------------------------
-- 2. On-duty fields
-- ---------------------------------------------------------------------
-- All nullable: OD is optional, and a registration without it is valid.
-- needs_od drives whether the form collects the rest.
--
-- Class slots affected by a 2:30 - 4:30 PM session:
--   slot 1 -- 2:20 to 3:10
--   slot 2 -- 3:10 to 4:00
--   slot 3 -- 4:00 to 4:50   [CONFIRM: recorded as "4:50" in the brief]

alter table public.session_registrations
  add column if not exists needs_od        boolean not null default false,
  add column if not exists slot1_subject   text,
  add column if not exists slot1_code      text,
  add column if not exists slot1_faculty   text,
  add column if not exists slot2_subject   text,
  add column if not exists slot2_code      text,
  add column if not exists slot2_faculty   text,
  add column if not exists slot3_subject   text,
  add column if not exists slot3_code      text,
  add column if not exists slot3_faculty   text,
  add column if not exists advisor_name    text,
  add column if not exists advisor_email   text;

-- Guard: if OD is requested, the advisor details must be present.
-- Per-slot fields stay optional, since a student may genuinely have a
-- free period in one of the three slots.

alter table public.session_registrations
  drop constraint if exists session_registrations_od_check;

alter table public.session_registrations
  add constraint session_registrations_od_check
  check (
    needs_od = false
    or (
      advisor_name is not null and length(btrim(advisor_name)) > 0
      and advisor_email is not null and length(btrim(advisor_email)) > 0
    )
  );
