-- Run in the Supabase SQL editor after 001_saved_deals.sql.
-- Venura authenticates with Clerk; API routes use SUPABASE_SERVICE_ROLE_KEY
-- (bypasses RLS) and always filter by user_id. Block direct client access via PostgREST.

alter table public.saved_deals enable row level security;

-- Remove any policies that might allow anon/authenticated access.
drop policy if exists "Users can read own deals" on public.saved_deals;
drop policy if exists "Users can insert own deals" on public.saved_deals;
drop policy if exists "Users can update own deals" on public.saved_deals;
drop policy if exists "Users can delete own deals" on public.saved_deals;
drop policy if exists "saved_deals_select_own" on public.saved_deals;
drop policy if exists "saved_deals_insert_own" on public.saved_deals;
drop policy if exists "saved_deals_update_own" on public.saved_deals;
drop policy if exists "saved_deals_delete_own" on public.saved_deals;

-- No permissive policies for anon/authenticated: PostgREST denies all direct access.
-- The service_role key used in app/api/deals bypasses RLS.

revoke all on table public.saved_deals from anon, authenticated;

grant all on table public.saved_deals to service_role;
