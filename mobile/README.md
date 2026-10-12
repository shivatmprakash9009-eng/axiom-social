# AXIOM Social Mobile

React Native + Expo + TypeScript mobile workspace for Android and iOS.

## Requirements

- Node.js compatible with Expo SDK 54
- npm
- Expo Go for supported preview workflows, or a native development build for full device validation

## Setup

```bash
npm install
npx expo install --check
npx expo start
```

Scan the QR code with Expo Go or use the appropriate Android/iOS development environment. On Android, pressing `a` opens an available emulator. On macOS with Xcode installed, `i` opens iOS Simulator.

## Current scope

The app currently contains a polished UI foundation for Home, Planner, Assistant, Inbox, Insights, and a media-first Composer. Sample content and metrics are labelled as previews. Image/video selection works locally on-device.

The following are **not yet connected**: production authentication, account OAuth, AI inference, persistent draft storage, background scheduling, publishing, inbox reply sending, analytics APIs, and push notifications.

## Important

- The composer never claims to publish successfully.
- Do not insert API keys or social access tokens in `EXPO_PUBLIC_*` variables.
- Provider credentials belong in a trusted backend.
- Confirm Instagram/YouTube account eligibility and permissions before treating integrations as delivery-ready.
