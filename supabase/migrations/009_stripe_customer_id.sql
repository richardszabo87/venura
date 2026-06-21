-- Stripe Customer Portal: ensure stripe_customer_id column and lookup index exist.
-- Run after 008_location_intelligence.sql

alter table public.user_profiles
  add column if not exists stripe_customer_id text;

create index if not exists user_profiles_stripe_customer_id_idx
  on public.user_profiles (stripe_customer_id)
  where stripe_customer_id is not null;
