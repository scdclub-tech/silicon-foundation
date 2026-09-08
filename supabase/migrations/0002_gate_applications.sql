-- Gate the SCD Community application flow behind a launch timestamp.
--
-- Mirrors the approach in 0001_session_registrations.sql: the React check
-- is UI convenience, this policy is the real gate.
--
-- Two places must be changed on launch day:
--   1. applicationsOpenAt in src/data/applicationQuestions.js
--   2. BOTH timestamps below
--
-- Until then every application insert and every resume upload is rejected.

-- ---------------------------------------------------------------------
-- 1. applications table
-- ---------------------------------------------------------------------
-- Existing policy is "public insert" with_check = true, which accepts
-- anything from anyone at any time.

drop policy if exists "public insert" on public.applications;

-- TODO: replace the timestamp with the confirmed applications opening
-- datetime (IST) when the website is announced.
create policy applications_insert_when_open
  on public.applications
  for insert
  to anon
  with check (now() >= timestamptz '2099-01-01 00:00:00+05:30');

-- No select policy is created. Applications remain unreadable by anon,
-- which is the existing behaviour and must stay that way.

-- ---------------------------------------------------------------------
-- 2. resumes bucket upload
-- ---------------------------------------------------------------------
-- The bucket itself is correctly configured: public = false, 5 MB limit,
-- application/pdf only. The problem is the upload policy, which lets
-- anyone holding the anon key push files into it unconditionally --
-- independent of the form, and with no time restriction. On the free
-- tier that is roughly 200 files to exhaust the 1 GB quota and break
-- uploads for real applicants.

drop policy if exists "public upload i5g8va_0" on storage.objects;

-- TODO: keep this timestamp identical to the one above.
create policy resumes_upload_when_open
  on storage.objects
  for insert
  to anon
  with check (
    bucket_id = 'resumes'
    and now() >= timestamptz '2099-01-01 00:00:00+05:30'
  );

-- No select, update or delete policy on storage.objects for anon.
-- Resumes are readable through the service role only.
