# AXIOM Social MVP Acceptance Criteria

## Mobile UX

- [ ] Android and iOS launch into a clear loading/authenticated state.
- [ ] Five primary tabs work and show selected state.
- [ ] Screen transitions are smooth and respect reduced motion.
- [ ] Empty, loading, offline, error and retry states exist.
- [ ] Accessibility labels, dynamic text and touch targets are reviewed.
- [ ] No fake account metrics or simulated successful publishing are shown as real data.

## Connections

- [ ] User can initiate official OAuth for Instagram and YouTube.
- [ ] Backend validates state and stores tokens securely.
- [ ] App shows account identity, permissions/capabilities and connection health.
- [ ] User can disconnect; revoked/expired authorization is handled.

## Content and scheduling

- [ ] User can create, edit, save and delete a draft.
- [ ] User can upload supported media with validation and progress.
- [ ] Each platform receives a separately editable preview and metadata.
- [ ] Scheduling requires explicit date/time and timezone.
- [ ] Backend persists jobs and publishes when due independent of the mobile app running.

## Publishing and reliability

- [ ] Every job has an inspectable lifecycle and timestamped status.
- [ ] Multi-platform publishing tracks each target independently.
- [ ] Ambiguous provider outcomes are reconciled before retry.
- [ ] Retries cannot blindly duplicate a published post.
- [ ] Provider errors and permission failures offer actionable next steps.
- [ ] Approval policy is enforced server-side, not only in the UI.

## Security and QA

- [ ] No API secrets or access tokens in mobile bundle, logs, or repository.
- [ ] Backend enforces workspace ownership and scopes.
- [ ] Input validation, rate limits and audit events are in place.
- [ ] Automated checks and manual test evidence recorded.
- [ ] Release candidate tested on representative Android and iOS devices.

## Scope notes

Passing these criteria requires actual backend services and approved provider access. Documentation and visual prototypes alone do not constitute a working production integration.
