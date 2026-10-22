-- Project Haven — Phase 1: member profiles, policy versions, consent records.
--
-- Security model (see docs/phase-1-auth.md):
--   * Members can read only their own rows (RLS).
--   * Members can directly update only display_name, country_code,
--     preferred_language and support_interests (column-level grants + RLS).
--   * Age eligibility, onboarding progress, consent records and deletion
--     requests change only through the SECURITY DEFINER functions below,
--     which enforce the business rules server-side.
--   * Consent rows are append-only for members: no direct insert/update/delete.

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------

create type public.age_eligibility as enum ('unknown', 'eligible', 'ineligible');
create type public.onboarding_status as enum ('not_started', 'in_progress', 'completed');

-- ---------------------------------------------------------------------------
-- Policy versions (source of truth for which terms/privacy text is current)
-- ---------------------------------------------------------------------------

create table public.policy_versions (
  consent_type text not null check (consent_type in ('terms_of_service', 'privacy_notice')),
  version text not null check (char_length(version) between 1 and 32),
  is_current boolean not null default false,
  is_draft boolean not null default true,
  published_at timestamptz not null default now(),
  primary key (consent_type, version)
);

-- At most one current version per policy type.
create unique index policy_versions_one_current
  on public.policy_versions (consent_type)
  where is_current;

-- Draft policy text is NOT legally reviewed (spec §6 step 5). Replace with
-- reviewed versions before any production launch.
insert into public.policy_versions (consent_type, version, is_current, is_draft)
values
  ('terms_of_service', '0.1-draft', true, true),
  ('privacy_notice', '0.1-draft', true, true);

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text
    check (display_name is null or char_length(display_name) between 1 and 40),
  country_code text
    check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  preferred_language text
    check (preferred_language is null or preferred_language ~ '^[a-z]{2,3}$'),
  support_interests text[] not null default '{}'
    check (support_interests <@ array['self_help', 'professional', 'peer', 'learning']::text[]),
  age_eligibility public.age_eligibility not null default 'unknown',
  age_declared_at timestamptz,
  onboarding_status public.onboarding_status not null default 'not_started',
  -- Furthest onboarding step reached: 1 welcome, 2 age, 3 profile,
  -- 4 preferences, 5 terms, 6 complete.
  onboarding_step smallint not null default 1 check (onboarding_step between 1 and 6),
  onboarding_completed_at timestamptz,
  deletion_requested_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Every new auth user gets exactly one profile row.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Consents (append-only evidence of acknowledgement)
-- ---------------------------------------------------------------------------

create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  consent_type text not null,
  policy_version text not null,
  required boolean not null,
  accepted_at timestamptz not null default now(),
  withdrawn_at timestamptz,
  foreign key (consent_type, policy_version)
    references public.policy_versions (consent_type, version),
  -- Retrying acceptance of the same version never creates duplicates.
  unique (user_id, consent_type, policy_version)
);

create index consents_user_id_idx on public.consents (user_id);

-- ---------------------------------------------------------------------------
-- Privileges and RLS
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.consents enable row level security;
alter table public.policy_versions enable row level security;

revoke all on public.profiles from anon, authenticated;
revoke all on public.consents from anon, authenticated;
revoke all on public.policy_versions from anon, authenticated;

grant select on public.profiles to authenticated;
grant update (display_name, country_code, preferred_language, support_interests)
  on public.profiles to authenticated;
grant select on public.consents to authenticated;
grant select on public.policy_versions to anon, authenticated;

create policy "Members read own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Members update own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Members read own consents"
  on public.consents for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Anyone reads policy versions"
  on public.policy_versions for select to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Server-enforced operations
-- ---------------------------------------------------------------------------

-- Age self-declaration. One-way: once answered it cannot be changed by the
-- member, so a "no" cannot be retried as a "yes" (spec §6 step 2).
create function public.declare_age(is_adult boolean)
returns public.age_eligibility
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  result public.age_eligibility;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if is_adult is null then
    raise exception 'invalid_input' using errcode = '22023';
  end if;

  update public.profiles
     set age_eligibility = case when is_adult then 'eligible' else 'ineligible' end::public.age_eligibility,
         age_declared_at = now(),
         onboarding_status = 'in_progress',
         onboarding_step = case when is_adult then greatest(onboarding_step, 3) else onboarding_step end
   where id = uid
     and age_eligibility = 'unknown'
  returning age_eligibility into result;

  if result is null then
    select age_eligibility into result from public.profiles where id = uid;
  end if;
  return result;
end;
$$;

-- Records that the member reached a later onboarding step. Steps can only
-- advance one at a time and only after the age gate has been passed.
create function public.advance_onboarding(target integer)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  p public.profiles;
  reached integer;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select * into p from public.profiles where id = uid for update;
  if not found then
    raise exception 'profile_missing' using errcode = 'P0002';
  end if;
  if target is null or target < 2 or target > 5 then
    raise exception 'invalid_step' using errcode = '22023';
  end if;
  if target > 2 and p.age_eligibility <> 'eligible' then
    raise exception 'not_eligible' using errcode = '42501';
  end if;
  if target > p.onboarding_step + 1 then
    raise exception 'step_out_of_order' using errcode = '22023';
  end if;

  update public.profiles
     set onboarding_step = greatest(onboarding_step, target),
         onboarding_status = case when onboarding_status = 'completed' then onboarding_status
                                  else 'in_progress' end
   where id = uid
  returning onboarding_step into reached;

  return reached;
end;
$$;

-- Records acknowledgement of the CURRENT required policy versions. The client
-- cannot choose which version it accepts. Idempotent.
create function public.accept_required_policies()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if not exists (
    select 1 from public.profiles where id = uid and age_eligibility = 'eligible'
  ) then
    raise exception 'not_eligible' using errcode = '42501';
  end if;

  insert into public.consents (user_id, consent_type, policy_version, required)
  select uid, pv.consent_type, pv.version, true
    from public.policy_versions pv
   where pv.is_current
  on conflict (user_id, consent_type, policy_version) do nothing;
end;
$$;

-- Marks onboarding complete once every precondition holds.
create function public.complete_onboarding()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  p public.profiles;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select * into p from public.profiles where id = uid for update;
  if not found then
    raise exception 'profile_missing' using errcode = 'P0002';
  end if;
  if p.age_eligibility <> 'eligible' then
    raise exception 'not_eligible' using errcode = '42501';
  end if;
  if p.onboarding_step < 5 then
    raise exception 'step_out_of_order' using errcode = '22023';
  end if;
  if exists (
    select 1
      from public.policy_versions pv
     where pv.is_current
       and not exists (
         select 1 from public.consents c
          where c.user_id = uid
            and c.consent_type = pv.consent_type
            and c.policy_version = pv.version
            and c.withdrawn_at is null
       )
  ) then
    raise exception 'consent_missing' using errcode = '42501';
  end if;

  if p.onboarding_status <> 'completed' then
    update public.profiles
       set onboarding_status = 'completed',
           onboarding_step = 6,
           onboarding_completed_at = now()
     where id = uid;
  end if;
end;
$$;

-- Records a deletion request for manual processing (Phase 1 interim process,
-- pending founder approval — see docs/phase-1-auth.md). Idempotent.
create function public.request_account_deletion()
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  requested timestamptz;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  update public.profiles
     set deletion_requested_at = coalesce(deletion_requested_at, now())
   where id = uid
  returning deletion_requested_at into requested;

  return requested;
end;
$$;

revoke all on function public.declare_age(boolean) from public, anon;
revoke all on function public.advance_onboarding(integer) from public, anon;
revoke all on function public.accept_required_policies() from public, anon;
revoke all on function public.complete_onboarding() from public, anon;
revoke all on function public.request_account_deletion() from public, anon;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;

grant execute on function public.declare_age(boolean) to authenticated;
grant execute on function public.advance_onboarding(integer) to authenticated;
grant execute on function public.accept_required_policies() to authenticated;
grant execute on function public.complete_onboarding() to authenticated;
grant execute on function public.request_account_deletion() to authenticated;
