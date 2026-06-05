-- Run after 003_user_profiles.sql.
-- Profiles are read/written only through /api/profile (Clerk + service_role).

alter table public.user_profiles enable row level security;

drop policy if exists "Users can read own profile" on public.user_profiles;
drop policy if exists "Users can insert own profile" on public.user_profiles;
drop policy if exists "Users can update own profile" on public.user_profiles;
drop policy if exists "user_profiles_select_own" on public.user_profiles;
drop policy if exists "user_profiles_insert_own" on public.user_profiles;
drop policy if exists "user_profiles_update_own" on public.user_profiles;

revoke all on table public.user_profiles from anon, authenticated;

grant all on table public.user_profiles to service_role;
