-- Subscription tier and monthly usage tracking for access control.

alter table public.user_profiles
  add column if not exists analyses_this_month integer not null default 0,
  add column if not exists analyses_month_reset date not null default date_trunc('month', current_date)::date,
  add column if not exists ai_messages_this_month integer not null default 0,
  add column if not exists ai_month_reset date not null default date_trunc('month', current_date)::date,
  add column if not exists subscription_tier text not null default 'free'
    check (subscription_tier in ('free', 'investor', 'pro')),
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text;

create index if not exists user_profiles_stripe_customer_id_idx
  on public.user_profiles (stripe_customer_id)
  where stripe_customer_id is not null;
