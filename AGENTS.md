# Agent System

Use the smallest set of `AGENTS.md` files needed for the task. For cross-boundary work, apply this file plus each touched subtree's file.

---

## Repository Map

* `frontend/` -> Expo app for iOS, Android, and web
* `backend/` -> Express server
* `backend/tests/api/` -> frontend/backend API compatibility tests
* Package manager: `pnpm`
* Node version: `26.x`

---

## Instruction Routing

* Root `AGENTS.md`: repo-wide architecture, shared contracts, version compatibility, naming, imports, environment rules, and validation entry points.
* `backend/AGENTS.md`: Express routes, controllers, middleware, validation, error handling, backend imports, and backend validation commands.
* `frontend/AGENTS.md`: Expo routing, screens, client data loading, cross-platform UX, styling, tokens, platform APIs, and frontend validation commands.
* `backend/tests/api/AGENTS.md`: API compatibility test categories, helpers, migration rules, and API test commands.

---

## Validation

Run the narrowest command that covers the change.

* All TypeScript: `pnpm typecheck`
* Full API compatibility tests: `pnpm test:api`
* Current frontend API contract only: `pnpm test:api:frontend`
* Latest API tests: `pnpm test:api:latest`
* Legacy API tests: `pnpm test:api:legacy`
* Deprecated API tests: `pnpm test:api:deprecated`
* Local app startup: `pnpm dev`

---

## API Contract Rules

* All API responses must be JSON objects with one stable shape per endpoint.
* Error responses must use:

```json
{
    "success": false,
    "error": {
        "message": "Invalid request",
        "code": "BAD_REQUEST"
    }
}
```

* Use the same camelCase field names in frontend requests, backend request parsing, backend responses, and frontend destructuring.
* When frontend API usage changes, update `backend/tests/api/frontend-contract.test.ts` in the same change.
* If frontend and backend depend on the same data shape, define it in shared code when a shared module exists; otherwise document the shape beside the API implementation and frontend caller.

---

## API Design And Versioning

* Backend changes must support older app versions unless the user explicitly approves deprecation.
* Additive response fields are allowed within the same major version.
* Removing fields, removing behavior, or making a supported request fail requires an approved backend major-version change.
* When a route or function is no longer used by the current frontend but must still support older app versions, move it to clearly named legacy support and emit a deprecation warning.
* When approved deprecation removes support, increment `backend/package.json` major version and update the current frontend to the new explicit endpoint version.
* Prefer extending an existing endpoint only when the endpoint name still describes the behavior and the added work does not slow initial-viewport frontend data. Otherwise add a focused endpoint.
* Data needed by top-of-screen frontend UI should come from the lightest request that can serve that UI without blocking on unrelated payloads.

---

## Import And Module Rules

* Prefer configured absolute imports.
* Backend internal imports should use package import aliases from `backend/package.json`.
* Frontend app imports should use configured TypeScript/Babel aliases.
* Use relative imports only within a small local folder when they are clearer than an alias.
* Add a new alias when a new folder is imported broadly across the codebase.

---

## Environment Rules

* Never hardcode secrets.
* Backend owns secret access and secret-dependent behavior.
* Environment-specific safe config, such as ports and API base URLs, belongs in environment files or documented local setup, not inline constants.
* Frontend code must not read backend-only secrets.

---

## Code Shape Rules

* Prefer existing local patterns, helpers, and components before adding new abstractions.
* Add shared helpers only when they remove duplicated logic from at least two call sites or define a clear domain boundary.
* Keep validation and normalization at API/service boundaries instead of scattering fallback handling through UI code.
* Keep async flows linear; use `.then()` for short single-step flows and `async/await` when branching, sequencing, or error handling is needed.
* Refactors must preserve behavior unless the user explicitly asks for behavior changes.
