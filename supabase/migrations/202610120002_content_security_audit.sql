-- AXIOM Social secure foundation, stage 2: tenant-owned content and audit trail.
begin;

create type public.draft_status as enum ('draft', 'in_review', 'approved', 'scheduled', 'published', 'failed', 'archived');

create table public.content_drafts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by uuid not null default auth.uid() references auth.users(id) on delete restrict,
  title text not null default '' check (char_length(title) <= 240),
  body text not null default '' check (char_length(body) <= 10000),
  status public.draft_status not null default 'draft',
  metadata jsonb not null default '{}'::jsonb check (pg_column_size(metadata) <= 32768),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index content_drafts_workspace_updated_idx on public.content_drafts(workspace_id, updated_at desc);
create index content_drafts_workspace_status_idx on public.content_drafts(workspace_id, status);

create table public.audit_events (
  id bigint generated always as identity primary key,
  workspace_id uuid references public.workspaces(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(action) between 1 and 120),
  resource_type text not null check (char_length(resource_type) between 1 and 80),
  resource_id text check (resource_id is null or char_length(resource_id) <= 200),
  details jsonb not null default '{}'::jsonb check (pg_column_size(details) <= 8192),
  created_at timestamptz not null default now()
);
create index audit_events_workspace_created_idx on public.audit_events(workspace_id, created_at desc);

-- Provider tokens and secrets are deliberately absent from client-readable tables.
-- Future connector credentials must be server-managed and encrypted, with no authenticated SELECT policy.
alter table public.content_drafts enable row level security;
alter table public.audit_events enable row level security;

create policy "drafts_select_workspace_members" on public.content_drafts
  for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "drafts_insert_editors" on public.content_drafts
  for insert to authenticated with check (
    created_by = (select auth.uid())
    and public.has_workspace_role(workspace_id, array['owner','admin','editor']::public.workspace_role[])
  );
create policy "drafts_update_editors" on public.content_drafts
  for update to authenticated using (
    public.has_workspace_role(workspace_id, array['owner','admin','editor']::public.workspace_role[])
  ) with check (
    public.has_workspace_role(workspace_id, array['owner','admin','editor']::public.workspace_role[])
  );
create policy "drafts_delete_admins" on public.content_drafts
  for delete to authenticated using (
    public.has_workspace_role(workspace_id, array['owner','admin']::public.workspace_role[])
  );

-- Audit events are append-only from trusted server code; clients may read their workspace's events.
create policy "audit_select_workspace_admins" on public.audit_events
  for select to authenticated using (
    workspace_id is not null
    and public.has_workspace_role(workspace_id, array['owner','admin']::public.workspace_role[])
  );

revoke all on public.content_drafts, public.audit_events from anon;
grant select, insert, update, delete on public.content_drafts to authenticated;
grant select on public.audit_events to authenticated;
revoke insert, update, delete on public.audit_events from anon, authenticated;

create trigger drafts_set_updated_at before update on public.content_drafts
  for each row execute procedure public.set_updated_at();

commit;
