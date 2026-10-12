# AXIOM Social

**An AI-powered social-media operations platform for Instagram and YouTube.**

AXIOM Social is designed to help users connect eligible social accounts, plan content, create and edit drafts, schedule publishing workflows, review engagement, and understand execution status from one premium mobile workspace.

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
└── mobile/
    ├── app/
    ├── src/
    ├── app.json
    ├── package.json
    └── tsconfig.json
```

## Getting started

Requirements: Node.js supported by the selected Expo SDK, npm, and Expo Go or an Android/iOS development build.

```bash
cd mobile
npm install
npx expo install --check
npx expo start
```

Use the QR code in Expo Go where compatible, or launch an emulator/device with the appropriate development setup.

## Current status

**Scaffold in progress.** The repository is initialized for a clean mobile codebase. Social OAuth, AI provider wiring, persistent backend, real publishing, and analytics are not yet active. Do not use sample dashboard data as actual account activity.

## Delivery plan

- Days 1–3: scope and API access verification.
- Days 4–7: mobile foundation and design system.
- Days 8–14: assistant/content workflow and first verified connector.
- Days 15–21: second connector, planner, approvals and recovery.
- Days 22–26: device QA, security and regression testing.
- Days 27–30: acceptance, fixes and handover.

Actual integration delivery depends on the client's developer accounts, API permissions, app review and turnaround time.

## Security principles

- No provider access tokens or API secrets in the mobile application.
- OAuth and sensitive provider calls are handled by a trusted backend.
- Validate every action, account scope, media constraint, and approval rule server-side.
- Never blindly retry an uncertain publish; reconcile provider state to prevent duplicate content.
- Track each platform target independently and report partial completion honestly.
- Keep audit logs free of access tokens and unnecessary sensitive content.

See [Architecture](docs/architecture.md), [Connector verification](docs/integration-capabilities.md), and [MVP acceptance criteria](docs/acceptance-criteria.md).
