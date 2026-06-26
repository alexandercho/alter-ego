# Agent System

Use the smallest set of local instruction files that can solve the task cleanly, but compose them when a request crosses boundaries.

---

## Available Instructions

* `AGENTS.md` owns repo-wide conventions, shared contracts, imports, naming, and code-shape decisions
* `backend/AGENTS.md` owns Express server behavior, API structure, middleware, validation, versioning, and backend import conventions
* `frontend/AGENTS.md` owns Expo application behavior, responsive cross-platform UX, navigation, styling, and platform-aware rendering decisions
* `backend/tests/api/AGENTS.md` owns frontend/backend API compatibility test coverage, category breakdown, and runnable API test workflows

---

## How To Route Work

* Use this file for any change that touches both frontend and backend conventions
* Use `backend/tests/api/AGENTS.md` when backend API behavior changes or when frontend changes add, remove, or alter API calls
* Use `backend/AGENTS.md` for backend-specific design and implementation decisions
* Use `frontend/AGENTS.md` for Expo app behavior, web/mobile compatibility, routing, visual-system decisions, and performance decisions
* For cross-cutting refactors, apply this file plus the platform-specific instruction file for each touched area

---

## Folder Structure

* `frontend/` -> Expo app
* `backend/` -> Express server
* `AGENTS.md` files -> local agent instructions for the repo or subtree where they live

---

## API Conventions

* All API responses must be consistent JSON objects
* Avoid mixed response shapes
* Errors must be explicit and structured

Example:

```json
{
    "success": false,
    "error": {
        "message": "Invalid request",
        "code": "BAD_REQUEST"
    }
}
```

---

## Import Rules

* Prefer absolute imports wherever the runtime supports them cleanly
* Backend should use package import aliases for internal modules
* Frontend should use configured path aliases for app modules
* Use relative imports only when they are clearly simpler than an alias
* Shared code must live in explicit shared modules

---

## Frontend / Backend Contract Optimization

* Design frontend data loading and backend response shapes together using a top-to-bottom rendering priority
* Data needed by components nearest the top of the experience should be available first through the lightest practical requests
* If upper-page components need exclusive lightweight data, create dedicated backend requests instead of blocking them behind heavier shared payloads
* Minimize redundant fetching across screens, components, and modals by reusing compatible response shapes when it remains efficient
* If a proposed feature placement would create inefficient or repetitive request patterns, propose an alternative placement or interaction model
* If a feature must remain in that location, add purpose-built requests while preserving backward compatibility for older app versions until deprecation is explicitly approved
* When considering whether to extend an existing endpoint or add a new one, prefer the existing endpoint only if the added data or logic does not create noticeable perceived latency for the frontend experience that depends on it

---

## Version Compatibility

* Backend changes must continue supporting older app versions unless explicit approval is given to deprecate them
* Use the app version number as the source of truth when behavior must differ between current and older clients
* If backend logic exists only for older app versions, isolate it into clearly named sections or dedicated files so current-path logic stays easy to follow
* Keep version-specific compatibility code organized in a way that makes future cleanup straightforward once deprecation is explicitly approved
* When endpoint deprecation is approved, the backend major version should be incremented and the new current frontend path should use the new explicit endpoint version
* A route or function should move into legacy support when the current frontend no longer uses it but older supported frontends still may
* Legacy-only routes or functions that still work for older app versions should emit deprecation warnings until their removal is explicitly approved

---

## Naming Consistency

* Use the same camelCase field and variable names across frontend and backend whenever they represent the same concept
* Prefer request and response shapes that allow simple destructuring without frontend-only or backend-only renaming
* Name request variables so it is immediately clear which entity, action, or payload they refer to when moving between frontend and backend code
* Avoid unnecessary aliases when reading request bodies, params, query values, or API payloads unless there is a strong domain reason
* If a naming change is needed for clarity, update both sides of the contract together or preserve backward compatibility until the older name is explicitly deprecated
* Frontend and backend should use shared domain vocabulary
* Avoid duplicate naming for identical concepts

---

## Environment Variables

* All secrets must live in environment files or managed secret stores
* Never hardcode credentials
* Backend owns all secret handling
* Safe configuration values that vary by environment should also live in environment files instead of being hardcoded
* For frontend and backend development, place safe local config such as port numbers and API base URLs in development env files
* Keep environment-file usage limited to safe configuration data unless stricter secret-handling rules are explicitly required

---

## Shared Contracts

If frontend and backend depend on the same data shape:

* define it in a shared module if possible
* or document it explicitly in repo conventions

---

## Code Style Doctrine

This repository prioritizes:

* readability over cleverness
* direct expression of intent
* simple functions over abstractions
* predictable control flow over indirection
* minimal syntax noise
* readable left-to-right flow

Avoid:

* abstraction for its own sake
* unnecessary defensive coding
* overly verbose null handling
* deep inheritance chains
* config-driven architectures
* unnecessary factories
* excessive generic utilities
* multi-layer indirection chains

---

## Preferred Patterns

* Functional composition over classes
* Small, single-purpose functions
* Plain objects for data structures
* Local state preferred over global state
* Lightweight helpers and pure functions are preferred over heavy generic layers
* Prefer small files with a single responsibility
* Co-locate related logic when it improves clarity
* Avoid `utils` dumping grounds
* Split files when they exceed cognitive load, not line count
* If a new folder contains files that are accessed broadly throughout the codebase, add that folder to the absolute import path configuration instead of relying on deep relative imports

---

## Function Style

* Prefer implicit return arrow functions for inline logic
* Prefer direct function references when possible
* Pass functions instead of wrapping them
* Prefer `.then()` when the flow is short and linear
* Prefer `async/await` when branching, sequencing, or error handling becomes more complex
* Avoid hidden concurrency unless necessary
* Keep async flows linear and traceable
* Prefer ternary operators for simple branching
* Prefer concise boolean expressions over explicit branching when safe
* Prefer natural truthy/falsy evaluation over verbose equality checks when intent is clear

---

## Types And Boundaries

* Keep type annotations helpful and close to domain boundaries
* Avoid type gymnastics that obscure straightforward runtime behavior
* Avoid defensive null-checking unless it affects runtime safety
* Prefer assuming valid data flow after validation boundaries
* Normalize data at API/service layers instead of scattering fallback handling through UI code

---

## Parameters And Objects

* Prefer object destructuring in function parameters when it improves readability and avoids repetitive property access
* Avoid deeply nested parameter access inside function bodies when destructuring can flatten it
* Place the most commonly used parameter first or as the primary destructured field
* Provide sensible defaults for frequently used values directly in the function signature
* If usage patterns shift significantly, rename and reorder parameters to reflect new dominant usage patterns
* Prefer object property shorthand wherever it improves readability
* Reuse intuitive parameter and local variable names so they can be passed into objects cleanly
* Avoid redundant object construction such as `{ data: data }` when `{ data }` is equally clear
* Do not force shorthand if renaming the variable or reshaping the code would make the result more confusing

---

## Refactor Goals

* reduce verbosity
* remove duplication
* flatten nesting
* simplify naming
* eliminate unnecessary wrappers

Code cleanup and style improvements must never:

* change behavior unless explicitly intended
* introduce new architecture without a clear reason
* add unnecessary abstraction layers

Function signatures may be rewritten when it improves call-site clarity, but not at the cost of hidden behavior changes.
