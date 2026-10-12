# AXIOM Social — Next Production Upgrades

This document tracks what is implemented versus what still requires external credentials, a deployed environment, or authorized-account verification. A UI state or environment variable alone never proves a provider integration is live.

## Implemented in the secure-foundation branch

- Supabase identity and workspace schema split into staged migrations.
- Row-level security for profiles, workspaces, workspace membership, drafts, and audit events.
- Workspace owner is created atomically with the workspace.
- Mobile email authentication with PKCE and Expo SecureStore-backed session storage.
- Auth gate fails closed on partial Supabase configuration.
- Composer drafts persist locally between app sessions; draft storage is scoped to the signed-in user when Supabase is configured.
- Draft media is not copied into local draft JSON, uploaded, or published. Re-select media after restoring a draft.
- Provider capability states fail closed until verification evidence exists.
- CI validates SQL migrations, runs pgTAP structural checks, runs static privacy regression tests, checks Expo dependency compatibility, and type-checks TypeScript.

## Remaining release blockers

1. Configure separate Supabase projects for development and beta; apply migrations in a controlled, reviewed deployment.
2. Add integration tests with two authenticated users to prove cross-workspace isolation and role-specific permissions, including direct REST requests that bypass the UI.
3. Verify signup, email confirmation, login, expired/refresh token behavior, sign-out, and reinstall/session restoration on physical Android and iOS devices.
4. Move authoritative drafts to Supabase for cross-device sync, with conflict handling and workspace ownership checks. Local drafts are a device-only convenience, not cloud backup.
5. Implement a server-side API/Edge Functions layer with schema validation, rate limits, request IDs, structured redacted logs, and server-only secrets.
6. Implement each social provider behind its own feature flag and secure OAuth/token storage. Complete authorized-account tests for connect, refresh/revoke, permissions, upload, publishing, and failure recovery before enabling a capability.
7. Implement a durable job queue and idempotent scheduling/publishing workflow. Client-side timers are not a production scheduler.
8. Add AI generation through a server-side provider adapter; never embed model API keys in the mobile bundle. Add usage limits, abuse controls, and cost telemetry.
9. Add team invitation and role management through server-controlled operations; keep membership writes unavailable to direct client requests.
10. Add observability, backup/restore tests, dependency/security scanning, app privacy disclosures, store signing, and staged beta rollout/rollback instructions.

## Beta acceptance gates

- No cross-tenant read/write path in authenticated integration tests.
- CI green on the exact release commit.
- No provider labelled connected/live without evidence from an authorized account.
- No secrets in mobile bundle, source control, client-readable tables, or logs.
- Failed/duplicate publish jobs are safe to retry and never silently reported as successful.
- A tester can export/delete their account data according to the published privacy policy.
