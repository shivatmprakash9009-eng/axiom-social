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

test('provider capabilities fail closed until authorized verification evidence exists', () => {
  const capabilities = readFileSync(new URL('../mobile/src/lib/capabilities.ts', import.meta.url), 'utf8');
  assert.match(capabilities, /state: 'unavailable'/);
  assert.match(capabilities, /return state === 'verified'/);
  assert.match(capabilities, /canExposeProviderAsLive/);
  assert.match(capabilities, /testAccountReference/);
  assert.match(capabilities, /testRunUrl/);
});

test('typed backend contracts enumerate authorization roles and stable API error codes', () => {
  const contracts = readFileSync(new URL('../mobile/src/types/backend.ts', import.meta.url), 'utf8');
  for (const role of ['owner', 'admin', 'editor', 'analyst', 'viewer']) assert.ok(contracts.includes(`'${role}'`));
  for (const code of ['UNAUTHENTICATED', 'FORBIDDEN', 'VALIDATION_ERROR', 'RATE_LIMITED', 'UPSTREAM_UNAVAILABLE']) assert.ok(contracts.includes(`'${code}'`));
});

test('migration files contain no escaped newline sequences from generated SQL edits', () => {
  for (const file of migrationFiles) {
    const sql = readFileSync(new URL(file, migrationDir), 'utf8');
    assert.doesNotMatch(sql, /\\\\nrevoke execute/i, `${file} must contain real line breaks`);
  }
});

test('local drafts are scoped by authenticated user and fail closed on partial auth config', () => {
  const drafts = readFileSync(new URL('../mobile/src/lib/localDrafts.ts', import.meta.url), 'utf8');
  assert.match(drafts, /STORE_PREFIX \+ session\.user\.id/);
  assert.match(drafts, /hasUrl !== hasKey/);
  assert.match(drafts, /Sign in to access account-scoped drafts/);
  assert.match(drafts, /MAX_DRAFTS = 100/);
});

test('composer draft persistence never stores temporary media URIs or claims to publish', () => {
  const drafts = readFileSync(new URL('../mobile/src/lib/localDrafts.ts', import.meta.url), 'utf8');
  const composer = readFileSync(new URL('../mobile/app/compose.tsx', import.meta.url), 'utf8');
  assert.match(drafts, /mediaName: string \| null/);
  assert.doesNotMatch(drafts, /mediaUri|assetUri|\.uri:/i);
  assert.match(composer, /saveLocalDraft/);
  assert.match(composer, /Media itself is not copied, uploaded, or published/);
});

test('configured account settings expose a confirmed sign-out action', () => {
  const settings = readFileSync(new URL('../mobile/app/settings.tsx', import.meta.url), 'utf8');
  assert.match(settings, /import \{ signOut \} from "@\/lib\/auth"/);
  assert.match(settings, /confirmSignOut/);
  assert.match(settings, /Sign out securely/);
  assert.match(settings, /authConfigured \?/);
});
