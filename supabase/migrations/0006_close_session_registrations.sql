-- Chip War session: close registrations early.
--
-- Registrations close on the morning of 6 October 2026, a day before the
-- session, to freeze the attendance list. 0004 had them closing when the
-- session starts on 7 October at 2:30 PM IST.
--
-- Existing rows are untouched: this only replaces the insert policy, so
-- everyone already registered stays registered.
--
-- To reopen, re-run the policy from
-- 0004_open_registrations_add_od_fields.sql with a new closing time.

-- ---------------------------------------------------------------------
-- 1. Close registrations
-- ---------------------------------------------------------------------
-- WITH CHECK (false) rejects every anon insert, whatever the clock says.
-- The registration page reports the resulting 42501 as "Registrations
-- for this session are closed."

drop policy if exists session_registrations_insert_when_open
  on public.session_registrations;

create policy session_registrations_insert_when_open
  on public.session_registrations
  for insert
  to anon
  with check (false);

-- ---------------------------------------------------------------------
-- 2. Sanity check
-- ---------------------------------------------------------------------
-- The frozen attendance list, and how many attendees asked for OD.

select
  count(*) as total_registrations,
  count(*) filter (where needs_od) as od_requested
from public.session_registrations;
