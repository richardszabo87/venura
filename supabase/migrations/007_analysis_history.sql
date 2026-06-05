-- Property analysis history (auto-saved on each Analyze click).

create table if not exists public.analysis_history (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  property_name text,
  address text,
  purchase_price numeric,
  monthly_rent numeric,
  monthly_cash_flow numeric,
  cap_rate numeric,
  cash_on_cash numeric,
  verdict text not null check (verdict in ('go', 'no-go', 'caution')),
  analyzed_at timestamptz not null default now()
);

create index if not exists analysis_history_clerk_user_id_analyzed_at_idx
  on public.analysis_history (clerk_user_id, analyzed_at desc);

alter table public.analysis_history enable row level security;

revoke all on table public.analysis_history from anon, authenticated;
grant all on table public.analysis_history to service_role;
