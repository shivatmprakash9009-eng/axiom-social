import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const migrationDir = new URL('../supabase/migrations/', import.meta.url);
const migrationFiles = readdirSync(migrationDir).filter((file) => file.endsWith('.sql')).sort();
const migrations = migrationFiles.map((file) => readFileSync(new URL(file, migrationDir), 'utf8'));
const allSql = migrations.join('\n');

test('migrations are staged and ordered', () => {
  assert.ok(migrationFiles.length >= 2, 'identity and content schema should be separate migrations');
  assert.deepEqual(migrationFiles, [...migrationFiles].sort());
});

test('every application table has row-level security enabled', () => {
  for (const table of ['profiles', 'workspaces', 'workspace_members', 'content_drafts', 'audit_events']) {
    assert.match(allSql, new RegExp(`alter table public\\.${table} enable row level security`, 'i'), `${table} must enable RLS`);
  }
});

test('client policies are scoped to authenticated users and tenant membership', () => {
  assert.match(allSql, /to authenticated using \(public\.is_workspace_member\(id\)\)/i);
  assert.match(allSql, /public\.has_workspace_role\(workspace_id/i);
  assert.match(allSql, /Membership mutations are intentionally server-controlled/i);
});

test('audit log is append-only for clients', () => {
  assert.match(allSql, /revoke insert, update, delete on public\.audit_events from anon, authenticated/i);
  assert.match(allSql, /audit_select_workspace_admins/i);
});

test('no provider credentials or service-role secret is introduced into public client configuration', () => {
  const env = readFileSync(new URL('../mobile/.env.example', import.meta.url), 'utf8');
  const client = readFileSync(new URL('../mobile/src/lib/supabase.ts', import.meta.url), 'utf8');
  assert.match(env, /EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  assert.doesNotMatch(env, /EXPO_PUBLIC_(SERVICE_ROLE_KEY|GROQ_API_KEY|OPENAI_API_KEY|INSTAGRAM_ACCESS_TOKEN|YOUTUBE_ACCESS_TOKEN)=/i);
  assert.match(client, /RLS is the security boundary/i);
  assert.match(client, /flowType: 'pkce'/);
});

test('no migration creates a client-readable social token table', () => {
  assert.doesNotMatch(allSql, /create table public\.(social_tokens|provider_tokens|oauth_tokens)/i);
});
