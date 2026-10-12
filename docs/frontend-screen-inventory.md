# AXIOM Social frontend screen inventory

This branch intentionally completes the navigable mobile UI before starting backend implementation. All non-existing service data is labelled as preview/sample content.

## Core navigation
- Home, Planner, Assistant, Inbox, Insights (five-tab bottom navigation)
- Global navigation drawer with Workspace, Engage and Control Room groups
- Global header shortcuts for search, notifications and navigation
- Animated stack transitions and modal composer/editor

## Screen suite
- Authentication (existing; only used when Supabase beta config is present)
- Home dashboard
- Content planner / calendar
- AI assistant conversation preview
- Inbox / comment reply preview
- Insights / analytics preview
- Compose / draft studio
- Visual editor
- Media library with remote visual reference imagery
- Creative templates gallery
- Automation control center
- Approvals queue
- Team and client workspaces
- Workspace switcher
- Profile and preferences
- Notification center
- Global search
- Settings / account connections

## Interaction conventions
- Pressable controls have accessible labels or visible titles.
- Search filters the local screen/action catalogue.
- Templates can be saved locally in screen state.
- Media reference cards can be selected in screen state.
- Automation toggles and approvals update only preview UI and explicitly do not execute real jobs.
- All external integrations remain visibly disconnected until a later authorized implementation.

## Frontend acceptance checklist

Merge gate: do not merge until a fresh CI run on the current head passes; prior failed runs are not evidence for later commits.
- [ ] Mobile TypeScript check passes on this branch.
- [ ] Expo dependency compatibility check passes.
- [ ] Regression tests pass.
- [ ] Every drawer destination resolves to a screen.
- [ ] Every screen has a clear route back or to the global drawer.
- [ ] Images load with a usable fallback on slow/offline connections.
- [ ] Test the navigation and scrolling on a small Android screen and iOS simulator.
- [ ] Replace remote reference images with reviewed/licensed bundled assets before production release.

## Explicitly not implemented here
No database, cloud draft synchronization, server API, provider OAuth, real AI calls, social publishing, billing, push notification service or live analytics are introduced by this UI pass.
