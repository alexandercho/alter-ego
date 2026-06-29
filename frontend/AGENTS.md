# Frontend Agent (Expo)

Apply root instructions first. This file adds Expo-only ownership and commands.

---

## Scope

Owns frontend behavior in `frontend/`, including Expo Router screens, navigation, client-side data loading, cross-platform UX, app-shell performance, styling, theme tokens, assets, and platform API boundaries.

Defer backend response shape and compatibility decisions to the root and `backend/AGENTS.md`. Defer API compatibility test mechanics to `backend/tests/api/AGENTS.md`.

---

## Validation Commands

Run commands from the repository root unless already inside `frontend/`.

* Typecheck frontend: `pnpm --dir frontend typecheck`
* Lint frontend: `pnpm --dir frontend lint`
* Start Expo: `pnpm --dir frontend start`
* Start web target: `pnpm --dir frontend web`
* Start iOS target: `pnpm --dir frontend ios`
* Start Android target: `pnpm --dir frontend android`

For frontend API call changes, also run `pnpm test:api:frontend` from the repository root.

---

## Current Frontend Structure

* `app/` -> Expo Router routes
* `screens/` -> screen-level UI composition
* `components/` -> reusable UI components
* `lib/` -> frontend service/client helpers, including API clients
* `constants/colors.ts` -> color tokens
* `constants/layouts.ts` -> spacing and layout tokens
* `constants/typography.ts` -> typography tokens

Configured import aliases from `frontend/tsconfig.json`:

* `@/*`
* `components/*`
* `constants/*`
* `lib/*`
* `screens/*`

---

## Cross-Platform Rules

* Features must work on iOS, Android, and web unless the task explicitly narrows platform support.
* Start with shared TypeScript components and logic.
* Use `.web.ts`, `.web.tsx`, `.native.ts`, or `.native.tsx` when platform behavior, APIs, or interaction models differ.
* Do not rely on mobile-only assumptions: fixed phone widths, gesture-only access, no hover, or no keyboard input.
* Critical actions must be available without hover.

---

## Expo And Dependencies

* Prefer Expo SDK packages and Expo-documented setup paths.
* Keep route, font, splash, and asset setup aligned with Expo conventions.
* Before adding a non-Expo native dependency, verify it supports the current Expo SDK and standard builds.
* If a dependency cannot run in Expo Go, isolate it behind a small wrapper with an Expo Go fallback and a developer-facing warning.
* Avoid dependencies that add broad unused functionality to the bundle.

---

## Navigation

* Expo Router files should map to shareable URLs.
* Use path segments for required identity, such as `/user/[userId]`; use query params only for optional filters or view state.
* Deep links must open the intended screen without relying on missing in-memory state.
* Keep tab, back, and browser-history behavior predictable across mobile and web.

---

## State And Data

* Screens compose UI and call hooks; reusable data loading belongs in hooks or shared frontend modules.
* Use local state unless multiple distant screens/components need the same state.
* Normalize API data at the fetch boundary.
* Loading, empty, and error states must render explicitly.
* Preserve the final layout footprint during loading and error states when collapsing would shift surrounding content.
* Follow root API contract rules for camelCase names and frontend contract tests.

---

## Styling And Tokens

* Use existing shared color and size tokens before adding values.
* Do not define raw hex colors in app files.
* Do not define raw sizing numbers when an existing token expresses the same meaning.
* Add a token only when it represents a reusable semantic value.
* Theme changes may alter colors only; spacing, layout, and typography must stay consistent between light and dark modes.
* Required color roles: `background`, `surface`, `overlay`, `textPrimary`, `textSecondary`, `border`, `success`, `warning`, `error`, and `info`.
* Text must remain readable in light and dark modes; primary content must not use low-contrast gray.

---

## Platform APIs

* Keep browser-only APIs out of shared native code paths.
* Keep native-only modules out of shared web code paths.
* Place repeated platform checks in small utility modules.
* If a screen or component is intentionally platform-only, render a clear unsupported-state message on other platforms.

---

## Component Boundaries

* Extract a component when the same UI or logic appears in two places.
* Split a file when it combines screen data loading, platform branching, and multiple reusable visual sections.
* Shared abstractions must reduce duplication without hiding platform-specific behavior.
