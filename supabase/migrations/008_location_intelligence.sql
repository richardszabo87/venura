-- Cached school and crime intelligence by zip code.

create table if not exists public.location_intelligence (
  zip_code text primary key,
  school_score numeric not null,
  crime_score numeric not null,
  school_summary text not null,
  crime_summary text not null,
  last_updated timestamptz not null default now()
);

create index if not exists location_intelligence_last_updated_idx
  on public.location_intelligence (last_updated desc);

alter table public.location_intelligence enable row level security;

revoke all on table public.location_intelligence from anon, authenticated;
grant all on table public.location_intelligence to service_role;
