# AXIOM Social — Architecture and UX

## Runtime surfaces

1. Mobile client: React Native + Expo, TypeScript.
2. Backend API: validates identity, permissions, request schemas, quotas and action policies.
3. AI orchestrator: turns user intent into a structured plan; it does not directly hold social account credentials.
4. Job queue/workers: schedules jobs, handles provider requests, reconciles uncertain outcomes, and emits observable status transitions.
5. Database/object storage: user/workspace settings, brand profile, connected-account metadata, media references, drafts, schedules, job state and audit events.

## Primary navigation

- Home: connection health, upcoming posts, approvals, activity, assistant entry point.
- Planner: calendar, draft and scheduled post queue, platform filters, date/time zone.
- Assistant: natural-language request, visible execution plan, edits, confirmations, run history.
- Inbox: provider-supported comments/messages and AI suggestions with escalation.
- Insights: metrics actually available through authorized APIs and transparent date ranges.

Settings contains account connections, automation policy, notifications, security and billing (if included in signed scope).

## Content lifecycle

Idea → Draft → Validated → Awaiting approval (when policy requires) → Scheduled/Queued → Publishing → Published.

Exceptional states: Needs attention, Failed, Cancelled, Partially completed. Every platform target is tracked as an independent job; a multi-platform campaign must never report full success when only one target succeeded.

## Backend action contract

The app sends intent or an explicit user-approved action to the backend. The backend:
- validates authenticated workspace membership,
- checks granted account scopes and verified connector capability,
- validates schema and content constraints,
- enforces approval and rate-limit rules,
- writes an audit record,
- enqueues work with an idempotency key,
- returns job IDs and status,
- publishes status updates without exposing provider tokens.

## Motion and performance

- Prefer transform/opacity animations and native-backed Reanimated worklets where supported.
- Avoid large layout animations on long lists; use virtualized lists.
- Keep gestures interruptible and scroll gestures predictable.
- Honor reduced-motion preferences.
- Make skeleton/loading, empty, offline and retry states first-class.
- Measure frame time and startup on target Android and iOS devices before claiming performance.

## Social integration notes

Instagram and YouTube are the first two integration targets, not assumed to be approved or active. Before integration is marked complete, verify the current official API documentation, account type/eligibility, OAuth scopes, app review status, quota, successful sandbox/test-account flow, publish result, token refresh and failure recovery.

OAuth tokens are server-side secrets. The mobile app receives only sanitized account metadata and job results.
