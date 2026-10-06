-- Enforce the 100-seat cap on Chip War registrations.
--
-- The site, the schedule PDF and the departmental announcement all state
-- that seating is limited to 100. Nothing in the database enforced that
-- until now, so the claim was unbacked.
--
-- The error message contains SESSION_FULL, which the registration page
-- catches to show the seats-full panel instead of a generic error.
--
-- A BEFORE INSERT trigger is used rather than a client-side count
-- because the client cannot read the table at all (anon has no SELECT,
-- by design), and because two simultaneous submissions would both pass
-- a client check.

create or replace function public.enforce_session_capacity()
returns trigger
language plpgsql
as $$
declare
  seat_limit constant int := 100;
  taken int;
begin
  select count(*) into taken from public.session_registrations;

  if taken >= seat_limit then
    raise exception 'SESSION_FULL: all % seats have been taken', seat_limit;
  end if;

  return new;
end;
$$;

drop trigger if exists session_registrations_capacity
  on public.session_registrations;

create trigger session_registrations_capacity
  before insert on public.session_registrations
  for each row execute function public.enforce_session_capacity();
