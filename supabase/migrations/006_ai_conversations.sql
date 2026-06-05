-- VenuraAI conversation memory (service_role API access only).

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists ai_conversations_clerk_user_id_created_at_idx
  on public.ai_conversations (clerk_user_id, created_at desc);

alter table public.ai_conversations enable row level security;

revoke all on table public.ai_conversations from anon, authenticated;
grant all on table public.ai_conversations to service_role;
