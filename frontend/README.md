# Frontend ☕ Expo Router

The frontend is the customer-facing half of Expresso: a shared Expo codebase for iOS, Android, and web with routing powered by Expo Router. ☕️

## Runtime

* `pnpm`
* `Node.js 26.x`

## Install And Run

```bash
pnpm install
pnpm start
```

Useful commands:

```bash
pnpm start
pnpm ios
pnpm android
pnpm web
pnpm lint
```

Expo provides Fast Refresh during development, so frontend UI updates should appear quickly while the dev server is running.

## Environment

Development config lives in `frontend/.env.development`.

Current safe config:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001
EXPO_PUBLIC_MIN_SUPPORTED_API_VERSION=v1
```

If you test on a physical device, replace `localhost` with your machine's local network IP.

## Frontend Rules Snapshot ☕

This app is guided by `AGENTS.md` and `frontend/AGENTS.md`.

Important expectations:

* Expo Router paths should be shareable and safe to send in email or chat
* prefer route segments like `/user/[userId]` over fragile query-param-driven identity
* prioritize top-to-bottom data delivery so users are likely to see content ready before they reach it
* reuse components when similar logic appears in multiple places
* split into `.web.ts`, `.web.tsx`, `.native.ts`, or `.native.tsx` when platform logic diverges meaningfully
* use shared style libraries and shared tokens instead of repeating common styles
* keep loading and error states footprint-stable to reduce layout flashes

## API Client

The API client lives in `frontend/lib/api.ts`, reads from `process.env.EXPO_PUBLIC_API_BASE_URL`, and centralizes the current versioned API path in one place.

Current pattern:

* `/health` remains an unversioned root health endpoint
* application requests are built from the shared `EXPO_PUBLIC_MIN_SUPPORTED_API_VERSION`
* the frontend checks `/health` for `latestSupportedApiVersion` before using versioned application endpoints
* screens and components should call semantic client functions instead of building endpoint URLs directly

Shared naming matters:

* keep camelCase names aligned with backend payloads
* avoid unnecessary renaming during destructuring
* reuse response shapes when it reduces redundant requests across screens and modals

## Expo Package Guidance

Preferred package order:

1. Expo SDK packages
2. packages documented or recommended by Expo
3. well-maintained third-party packages with strong adoption and a reasonable bundle footprint

If a package is not Expo Go compatible, the rule set expects a utility wrapper that detects Expo Go, returns a mock, and alerts the developer that the page is not fully testable there.

## Where To Look Next

* `app/` for routes and screens
* `components/` for reusable UI
* `lib/api.ts` for API access
* `AGENTS.md` and `frontend/AGENTS.md` for the detailed working rules
