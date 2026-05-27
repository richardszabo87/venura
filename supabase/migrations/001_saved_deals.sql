-- Run this in the Supabase SQL editor to create the saved_deals table.

create table if not exists public.saved_deals (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null default 'Untitled deal',
  address text not null default '',
  purchase_price numeric not null default 0,
  monthly_rent numeric not null default 0,
  hoa numeric not null default 0,
  taxes numeric not null default 0,
  insurance numeric not null default 0,
  down_payment numeric not null default 20,
  interest_rate numeric not null default 0,
  loan_term integer not null default 30,
  monthly_cash_flow numeric not null default 0,
  cap_rate numeric not null default 0,
  cash_on_cash numeric not null default 0,
  verdict text not null default 'caution',
  created_at timestamptz not null default now()
);

create index if not exists saved_deals_user_id_idx on public.saved_deals (user_id);

-- Deals are read/written only through Venura API routes (Clerk auth + user_id filter).
