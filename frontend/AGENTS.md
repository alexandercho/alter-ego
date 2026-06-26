# Frontend Agent (Expo)

## Scope

Owns Expo application behavior across native mobile and web.

---

## Responsibilities

* screen composition
* navigation structure
* client-side data fetching
* platform-aware UX behavior
* responsive layout decisions
* app-shell performance and startup behavior

---

## Cross-Platform Rules

* Every feature must work on iOS, Android, and web unless a requirement explicitly scopes it narrower
* Prefer shared components and shared logic before introducing platform-specific files
* Use platform-specific branches only when behavior, APIs, or ergonomics genuinely differ
* Avoid mobile-only assumptions around viewport size, hover absence, or gesture-only input
* If logic differs drastically between web and mobile, move it into separate `.web.ts`, `.web.tsx`, `.native.ts`, or `.native.tsx` files
* If a component grows too large because it is handling both web and mobile concerns, split it into platform-specific TypeScript implementations

---

## Expo Rules

* Prefer Expo-supported libraries and APIs before adding custom native complexity
* Keep native dependencies intentional and compatible with the current Expo SDK
* Route, font, splash, and asset setup should follow Expo conventions instead of custom bootstrapping
* Prefer config that works in Expo Go or standard Expo builds unless native customization is required
* Move safe environment-specific frontend config, such as the backend base URL, into development env files instead of hardcoding it
* Expo SDK packages are the first choice
* Packages recommended or mentioned in Expo documentation are preferred over less proven alternatives
* When evaluating packages, prefer strong maintenance signals: contributor count, update frequency, adoption, and package size
* Avoid adding large packages that bring substantial unused functionality and inflate the app bundle
* When adding a package that does not work in Expo Go, create a utility wrapper that detects Expo Go, returns a mock implementation there, and alerts the developer that the current page is not fully testable in Expo Go
* If a component only works on web, alert when it is reached on mobile
* If a component only works on mobile, alert when it is reached on web

---

## Web + Mobile UX

* Layouts must adapt cleanly from narrow mobile screens to wider web viewports
* Touch targets must remain usable on mobile, while web interactions should also support pointer and keyboard input
* Do not hide critical actions behind hover-only affordances
* Scrolling, safe-area handling, and focus states must feel natural on each platform

---

## Navigation

* Keep navigation structure shallow when possible
* Deep linking and browser history must remain coherent on web
* Screen titles, back behavior, and tab structure should feel native on mobile and predictable on web
* Structure `expo-router` files around shareable URLs that are safe to send in email or chat
* Prefer path segments like `/user/[userId]` over routes that depend on fragile query params for core identity
* A shared link should open the intended page directly without depending on missing runtime params

---

## State and Data

* Keep screens thin and move reusable logic into hooks or shared modules
* Prefer local state by default and introduce broader state only when multiple distant consumers need it
* Normalize API data near the boundary instead of scattering fallback handling through UI code
* Loading, empty, and error states must be explicit on every platform
* If multiple tabs share many of the same screens, consider a shared screen registry to keep navigation structure consistent
* Prioritize data loading from top to bottom so content visible in the initial viewport loads first
* Follow the repo contract optimization rules so data is likely to be ready before the user reaches each section of the screen
* Avoid redundant requests between screens, components, and modals when the data contract can be reused efficiently
* Match backend camelCase names for shared fields and payload variables whenever possible to keep destructuring simple and predictable
* When frontend API usage changes, update the current frontend contract tests so backend compatibility coverage still matches the real app

---

## Rendering and Performance

* Avoid unnecessary re-renders in large lists, navigation containers, and app-shell components
* Prefer incremental rendering patterns that preserve responsiveness on lower-end mobile devices
* Images, icons, and fonts should be sized and loaded intentionally for both native and web bundles
* Do not trade away clarity for micro-optimizations too early
* Components should render loading states that preserve the footprint of the final content to reduce visual flashing
* If a load fails, preserve the failed component's layout footprint instead of collapsing the screen unexpectedly

---

## Styling

* Prefer styles that scale across breakpoints rather than hardcoding for a single phone size
* Platform-specific styling is acceptable when required, but visual structure should stay consistent
* Animations should degrade gracefully across platforms and input modes
* Pull styles from a shared style library when possible
* If the same style pattern appears across multiple files, add it to the style library with an intuitive name and refactor callers to use it

---

## UI System

### Core Principle

Color modes are not stylistic variations. They are two representations of the same semantic system.

### Semantic Color Usage

* Never define or use raw hex colors directly in app files
* Always source colors from a shared color library or token system
* Reference semantic tokens such as `background`, `surface`, `textPrimary`, `textSecondary`, and `border` instead of appearance-driven color names
* Colors must map to meaning, not appearance

### Semantic Size Usage

* Never define or use raw sizing numbers directly in app files when a shared token already makes sense
* Always source reusable sizing values from a shared size library or token system
* Reference semantic tokens such as `normalText`, `title`, `subtitle`, `borderRadius`, `border`, `smallPadding`, and `largePadding` instead of appearance-driven size names
* Sizes must map to meaning, not appearance

### Consistency Rules

* The same component must render identically in structure across themes
* Only color values change between light and dark modes
* Spacing, layout, and typography must never change between themes

### Contrast Requirements

* Text must maintain readable contrast in both modes
* Avoid low-contrast grays for primary content
* Secondary text must remain legible, not decorative

### Background Hierarchy

Maintain consistent surface layering:

* `background` -> app base layer
* `surface` -> cards / containers
* `overlay` -> modals / elevated UI

These layers must exist in both modes with equivalent hierarchy, not identical colors.

### Dark Mode Rules

* The color library should avoid pure black backgrounds unless an intentional contrast system exists
* Prefer near-black surfaces for reduced eye strain
* Reduce intensity of shadows; rely more on elevation than blur-heavy shadows

### Light Mode Rules

* The color library should avoid pure white backgrounds for large surfaces if it creates glare
* Use subtle off-white backgrounds for depth
* Maintain visible separation between surfaces without heavy borders

### State Colors

State colors must remain consistent across modes:

* success
* warning
* error
* info

Only brightness and contrast adapt, not semantic meaning.

### Anti-Patterns

* Defining theme-specific hex values inline in components
* Duplicating components for light/dark variants
* Using opacity as a substitute for proper color tokens
* Inconsistent contrast treatment across screens

---

## Platform APIs

* Guard platform-specific APIs behind clear boundaries
* Prefer capability checks over assumptions about platform behavior
* Web-only browser APIs must not leak into shared mobile code paths
* Native-only modules must have a deliberate fallback or be isolated from web execution
* Platform-specific environment checks should live in small utility files rather than being duplicated across screens

---

## Components and File Size

* Extract a component when the same or very similar logic appears in another screen or component
* Do not let component files grow excessively long
* If size or platform branching makes a file hard to reason about, split it into smaller components or platform-specific entry files
* Shared abstractions should reduce duplication without hiding important platform behavior
