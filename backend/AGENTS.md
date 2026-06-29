# Backend Agent (Express)

Apply root instructions first. This file adds backend-only ownership and commands.

---

## Scope

Owns Express server behavior in `backend/`, including routes, controllers, middleware, request validation, service logic, data access, backend environment handling, and backend package imports.

Defer frontend API call updates and UI behavior to `frontend/AGENTS.md`. Defer API compatibility test structure to `backend/tests/api/AGENTS.md`.

---

## Validation Commands

Run commands from the repository root unless already inside `backend/`.

* Typecheck backend: `pnpm --dir backend typecheck`
* Lint backend: `pnpm --dir backend lint`
* Build backend: `pnpm --dir backend build`
* Run backend API tests: `pnpm --dir backend test:api`
* Start backend dev server: `pnpm --dir backend dev`

---

## Current Backend Structure

* `src/routes/` -> route registration and URL structure
* `src/controllers/` -> HTTP request/response translation
* `src/middleware/` -> reusable Express middleware
* `src/data/` -> data sources and persistence-facing code
* `src/utils/` -> small backend-only helpers that do not fit a domain folder

---

## Express Layering

* Routes bind paths and middleware, then call controllers.
* Controllers read request data, call services or data functions, and return structured JSON responses.
* Domain decisions must not be embedded in route registration.
* Middleware handles cross-cutting request behavior only: parsing, auth, logging, validation, and error handling.
* Keep HTTP-specific objects (`req`, `res`, `next`) out of pure service/data helpers.

---

## Validation And Errors

* Validate params, query values, and request bodies before using them.
* Normalize validated input once at the boundary and pass normalized values inward.
* Validation failures must return the root structured error shape.
* Use the centralized error handler for unexpected errors.
* Promise-returning handlers must either await errors or pass them to Express error handling.

---

## Backend Imports

Use package import aliases from `backend/package.json`:

* `#app`
* `#controllers/*`
* `#data/*`
* `#middleware/*`
* `#routes`
* `#routes/*`
* `#utils/*`

Use relative imports only within the same folder when that is clearer than an alias.

---

## Backend API Changes

* Follow root API versioning and contract rules.
* If backend behavior changes, run the matching API test category from `backend/tests/api/AGENTS.md`.
* If a current frontend API call is added, removed, or changed, update `backend/tests/api/frontend-contract.test.ts`.
* Keep legacy-only routes/functions in clearly named files or sections so current-path behavior remains easy to identify.
