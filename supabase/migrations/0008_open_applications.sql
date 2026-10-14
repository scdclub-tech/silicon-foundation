-- Open SCD Community applications: both gates set to 7 Oct 2026, 4:20 PM IST (already passed)

drop policy if exists resumes_upload_when_open on storage.objects;
create policy resumes_upload_when_open
  on storage.objects for insert to anon
  with check (bucket_id = 'resumes'
              and now() >= timestamptz '2026-10-07 16:20:00+05:30');

drop policy if exists applications_insert_when_open on public.applications;
create policy applications_insert_when_open
  on public.applications for insert to anon
  with check (now() >= timestamptz '2026-10-07 16:20:00+05:30');