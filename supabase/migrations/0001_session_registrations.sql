-- Chip War keynote session — attendee registrations.
--
-- This table is NOT the SCD Community application pipeline. Session
-- registration is open intake; membership applications live separately
-- under /join and must not be merged into this table.

create table if not exists public.session_registrations (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  full_name   text not null,
  reg_number  text not null unique,
  email       text not null,
  year        text not null,
  department  text not null,
  phone       text
);

alter table public.session_registrations
  add constraint session_registrations_year_check
  check (year in ('1', '2', '3', '4', '5', 'PG'));

create index if not exists session_registrations_created_at_idx
  on public.session_registrations (created_at desc);

alter table public.session_registrations enable row level security;

-- Anonymous visitors may insert, but ONLY once the window opens.
--
-- This is the real gate. The React date check is a UI convenience; this
-- policy is what actually stops early submissions, including from anyone
-- hitting the route directly or posting to the API.
--
-- TODO: replace the timestamp below with the confirmed registration
-- opening datetime (IST). Until then every insert is rejected, which is
-- the intended pre-launch state.
create policy session_registrations_insert_when_open
  on public.session_registrations
  for insert
  to anon
  with check (now() >= timestamptz '2099-01-01 00:00:00+05:30');

-- No anonymous read. Registration data is not publicly listable.
-- Reads happen through the service role only.
revoke select on public.session_registrations from anon;
