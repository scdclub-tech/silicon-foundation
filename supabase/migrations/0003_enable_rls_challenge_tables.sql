-- Enable row-level security on the four challenge tables that currently
-- have it disabled.
--
-- WHY THIS MATTERS
-- With RLS off, the anon key -- which ships inside the client JavaScript
-- bundle and is public by design -- has full read, insert, update and
-- delete access to these tables. The exposure is not primarily a leak
-- (the columns hold names and roll numbers, not contact details); it is
-- that anyone could delete every stored challenge result.
--
-- WHY INSERT AND SELECT STAY OPEN
-- The /challenges routes are locked and must keep working. They record
-- results and read them back through the anon key. Enabling RLS with no
-- policies would deny everything and break them. These policies preserve
-- exactly the operations the challenge system performs, and remove the
-- two it never performs.
--
-- AFTER RUNNING THIS, TEST A CHALLENGE END TO END. If any activity
-- performs an update or an upsert, it will fail and will need its own
-- policy.

-- ---------------------------------------------------------------------
-- students
-- ---------------------------------------------------------------------
alter table public.students enable row level security;

create policy students_anon_insert
  on public.students for insert to anon with check (true);

create policy students_anon_select
  on public.students for select to anon using (true);

-- ---------------------------------------------------------------------
-- foundry_ceo_results
-- ---------------------------------------------------------------------
alter table public.foundry_ceo_results enable row level security;

create policy foundry_ceo_results_anon_insert
  on public.foundry_ceo_results for insert to anon with check (true);

create policy foundry_ceo_results_anon_select
  on public.foundry_ceo_results for select to anon using (true);

-- ---------------------------------------------------------------------
-- silicon_detective_results
-- ---------------------------------------------------------------------
alter table public.silicon_detective_results enable row level security;

create policy silicon_detective_results_anon_insert
  on public.silicon_detective_results for insert to anon with check (true);

create policy silicon_detective_results_anon_select
  on public.silicon_detective_results for select to anon using (true);

-- ---------------------------------------------------------------------
-- tapeout_sprint_results
-- ---------------------------------------------------------------------
alter table public.tapeout_sprint_results enable row level security;

create policy tapeout_sprint_results_anon_insert
  on public.tapeout_sprint_results for insert to anon with check (true);

create policy tapeout_sprint_results_anon_select
  on public.tapeout_sprint_results for select to anon using (true);

-- No update or delete policies are created for any table. Those
-- operations are now blocked for anon and available through the service
-- role only.
