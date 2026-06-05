-- User profiles for Clerk-authenticated Venura users.
-- Run after 002_saved_deals_rls.sql. API routes use service_role + clerk_user_id filter.

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  buyer_type text check (
    buyer_type is null
    or buyer_type in ('first_time_buyer', 'move_up_buyer', 'investor', 'all')
  ),
  budget_min numeric,
  budget_max numeric,
  target_markets text[] default '{}',
  min_cash_flow numeric,
  max_hoa numeric,
  financing_type text check (
    financing_type is null
    or financing_type in ('home_equity', 'conventional', 'cash', 'undecided')
  ),
  management_style text check (
    management_style is null
    or management_style in ('self', 'semi', 'managed')
  ),
  goal text check (
    goal is null
    or goal in ('cash_flow', 'appreciation', 'both', 'learning', 'primary_home')
  ),
  timeline text check (
    timeline is null
    or timeline in ('asap', '3months', '6months', '1year', 'exploring')
  ),
  investor_profile_name text,
  properties_analyzed integer not null default 0,
  properties_saved integer not null default 0,
  journey_stage text not null default 'exploring' check (
    journey_stage in (
      'exploring',
      'educating',
      'searching',
      'ready',
      'under_contract',
      'owner'
    )
  ),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_profiles_clerk_user_id_idx
  on public.user_profiles (clerk_user_id);

create or replace function public.set_user_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_profiles_updated_at on public.user_profiles;

create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row
  execute function public.set_user_profiles_updated_at();
