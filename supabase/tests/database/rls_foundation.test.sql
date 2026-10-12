begin;
select plan(12);

select has_table('public', 'profiles', 'profiles table exists');
select has_table('public', 'workspaces', 'workspaces table exists');
select has_table('public', 'workspace_members', 'membership table exists');
select has_table('public', 'content_drafts', 'drafts table exists');
select has_table('public', 'audit_events', 'audit trail table exists');

select ok((select relrowsecurity from pg_class where oid = 'public.profiles'::regclass), 'profiles has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.workspaces'::regclass), 'workspaces has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.workspace_members'::regclass), 'memberships has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.content_drafts'::regclass), 'drafts has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.audit_events'::regclass), 'audit events has RLS enabled');

select ok(not has_table_privilege('anon', 'public.content_drafts', 'select'), 'anonymous role cannot read drafts');
select ok(not has_table_privilege('authenticated', 'public.audit_events', 'insert'), 'clients cannot write audit events');

select * from finish();
rollback;
