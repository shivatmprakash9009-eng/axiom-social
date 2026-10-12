# AXIOM Social

**An AI-powered social-media operations platform for Instagram and YouTube.**

AXIOM Social is designed to help users connect eligible social accounts, plan content, create and edit drafts, schedule publishing workflows, review engagement, and understand execution status from one premium mobile workspace.

## Download the Android app

### [Download the latest AXIOM Social APK](https://github.com/shivatmprakash9009-eng/axiom-social/releases/download/mobile-apk/axiom-social.apk)

The link points to the APK published by the Android build workflow. If a build has not completed successfully yet, open [Latest Android Preview Release](https://github.com/shivatmprakash9009-eng/axiom-social/releases/tag/mobile-apk) and check the release assets.

**Install:** download the APK on your Android phone, open the file, allow installation from that source if Android asks, and tap Install.

**Important:** this is currently an installable development preview. The app UI and local media selection are included, but Instagram/YouTube OAuth, live AI, cloud-saved drafts, background scheduling and real publishing are not implemented yet. Do not treat sample dashboard numbers or sample posts as real account data.

## Product direction

- **Mobile first:** Android and iOS using React Native, Expo and TypeScript.
- **Luxury minimal UI:** obsidian, graphite, ivory, restrained champagne accents.
- **Five core destinations:** Home, Planner, Assistant, Inbox and Insights.
- **AI with boundaries:** AI plans and drafts; backend policies enforce permissions and approvals.
- **Observable workflows:** each account action has its own state, error detail and audit trail.
- **Platform-realistic integrations:** only capabilities verified for the selected account, scopes and current official APIs are exposed.

## First integrations

1. Instagram
2. YouTube

These are the first implementation targets. A connector is not considered shipped until OAuth, account eligibility, permissions, real test publishing, quota behavior, token refresh and failure recovery have been verified.

## Repository layout

```text
axiom-social/
├── README.md
├── docs/
│   ├── architecture.md
│   ├── integration-capabilities.md
│   └── acceptance-criteria.md
├── .github/workflows/
│   ├── mobile-check.yml
│   └── android-apk.yml
└── mobile/
    ├── app/
    ├── src/
    ├── app.json
    ├── package.json
    └── tsconfig.json
```

## Build and run from source

Requirements: Node.js 20.19.4, npm, and Android tooling for native builds.

```bash
cd mobile
npm install
npx expo install --check
npx expo start
```

The GitHub Actions workflow generates the native Android project, builds an installable release APK, and publishes it to the stable preview-release link above when the workflow succeeds. You can also download the workflow artifact from the [Actions tab](https://github.com/shivatmprakash9009-eng/axiom-social/actions).

## Production planning

The verified codebase gap analysis, recommended architecture, provider API feasibility matrix, security plan, implementation milestones, and release acceptance criteria are documented in [Production Readiness Audit](docs/production-readiness-audit.md). This is a documentation-only audit; it does not mean any backend or provider integration is implemented or live.

## Secure foundation status

The `feat/secure-foundation` work introduces staged Supabase migrations for profiles, workspaces, workspace memberships, content drafts and append-only audit events; row-level security policies; a secure mobile auth client scaffold; and database/security regression tests. It is not production-connected until a Supabase project is configured and migrations plus authenticated-user isolation tests pass against that project. No Instagram, YouTube, AI, publishing, or billing connector is live.

Use separate Supabase projects for local development, beta/staging and production. Only the Supabase publishable key and project URL belong in the mobile environment. Service-role keys and provider secrets must stay server-side.

## Current status

**Mobile scaffold in progress.** The repository contains the UI foundation, local media composer, settings screens, architecture documentation, acceptance criteria, and APK build workflow. Social OAuth, AI provider wiring, persistent backend, real publishing, and analytics are not yet active.

## Security principles

- No provider access tokens or API secrets in the mobile application.
- OAuth and sensitive provider calls are handled by a trusted backend.
- Validate every action, account scope, media constraint, and approval rule server-side.
- Never blindly retry an uncertain publish; reconcile provider state to prevent duplicate content.
- Track each platform target independently and report partial completion honestly.
- Keep audit logs free of access tokens and unnecessary sensitive content.

See [Architecture](docs/architecture.md), [Connector verification](docs/integration-capabilities.md), and [MVP acceptance criteria](docs/acceptance-criteria.md).
