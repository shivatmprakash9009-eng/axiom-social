-- AXIOM Social secure foundation, stage 1: identity and workspace tenancy.
-- Apply with Supabase migrations; never edit an applied migration in place.
begin;

create extension if not exists pgcrypto with schema extensions;

create type public.workspace_role as enum ('owner', 'admin', 'editor', 'analyst', 'viewer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) <= 120),
  avatar_url text check (avatar_url is null or char_length(avatar_url) <= 2048),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.workspace_role not null default 'viewer',
  joined_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create index workspace_members_user_id_idx on public.workspace_members(user_id, workspace_id);

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = (select auth.uid())
  );
$$;

create or replace function public.has_workspace_role(target_workspace_id uuid, allowed_roles public.workspace_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = (select auth.uid())
      and wm.role = any(allowed_roles)
  );
$$;

-- Provision a profile from the trusted auth.users insert event.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    nullif(left(coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', ''), 120), ''),
    nullif(left(coalesce(new.raw_user_meta_data ->> 'avatar_url', ''), 2048), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger workspaces_set_updated_at before update on public.workspaces
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

create policy "profile_select_self" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "profile_insert_self" on public.profiles
  for insert to authenticated with check (id = (select auth.uid()));
create policy "profile_update_self" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "workspace_select_members" on public.workspaces
  for select to authenticated using (public.is_workspace_member(id));
create policy "workspace_create_as_self" on public.workspaces
  for insert to authenticated with check (created_by = (select auth.uid()));
create policy "workspace_update_admins" on public.workspaces
  for update to authenticated using (public.has_workspace_role(id, array['owner','admin']::public.workspace_role[]))
  with check (public.has_workspace_role(id, array['owner','admin']::public.workspace_role[]));
create policy "workspace_delete_owner" on public.workspaces
  for delete to authenticated using (public.has_workspace_role(id, array['owner']::public.workspace_role[]));

create policy "membership_select_workspace_members" on public.workspace_members
  for select to authenticated using (public.is_workspace_member(workspace_id));
-- Membership mutations are intentionally server-controlled. No client INSERT/UPDATE/DELETE policy.

revoke all on public.profiles, public.workspaces, public.workspace_members from anon;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.workspaces to authenticated;
grant select on public.workspace_members to authenticated;
grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.has_workspace_role(uuid, public.workspace_role[]) to authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;

commit;
