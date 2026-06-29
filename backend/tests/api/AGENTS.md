# API Testing Agent

Apply root and backend instructions first. This file owns API compatibility tests in `backend/tests/api/`.

---

## Scope

Owns tests that prove the backend still matches current frontend API usage and the latest, legacy, and deprecated API version rules.

Defer API behavior design to the root and `backend/AGENTS.md`. Defer frontend caller design to `frontend/AGENTS.md`.

---

## Validation Commands

Run from the repository root:

* All API tests: `pnpm test:api`
* Current frontend contract: `pnpm test:api:frontend`
* Latest API tests: `pnpm test:api:latest`
* Legacy API tests: `pnpm test:api:legacy`
* Deprecated API tests: `pnpm test:api:deprecated`

Equivalent backend-local commands are available with `pnpm --dir backend`.

---

## Test Categories

* `latest.test.ts` -> current explicit major-version routes and request shapes must work.
* `legacy.test.ts` -> older supported routes and request shapes must still work.
* `deprecated.test.ts` -> removed routes or request shapes must fail clearly.
* `frontend-contract.test.ts` -> every API request used by the current frontend must work.

---

## Test Structure

* Use real HTTP requests against the local backend test server for compatibility coverage.
* Keep shared setup in `helpers/api-test-server.ts`.
* Keep repeated response assertions in helper files instead of copying endpoint logic across tests.
* Keep category-specific entry points so failures identify latest, legacy, deprecated, or current-frontend contract behavior.
* Deprecated tests must confirm `/health` succeeds before asserting that a deprecated request fails.

---

## API Version Test Migration

* When a new backend major version is introduced, copy current latest coverage to the new latest version paths and expected behavior.
* Move previous latest coverage to legacy coverage if those routes still work.
* Move previous legacy coverage to deprecated coverage when those routes are intentionally removed.
* When a route/function moves to legacy support because the current frontend stopped using it, add legacy coverage that confirms it works and emits a deprecation warning.
* If a legacy route/function becomes current again within the same major version, move its coverage back to latest and remove the warning expectation.

---

## Coverage Maintenance

* When backend compatibility rules change, update these tests in the same change.
* When frontend API calls change, update `frontend-contract.test.ts` in the same change.
* If legacy or deprecated suites become slow enough to affect local feedback, report the runtime and largest files instead of deleting coverage without explicit approval.
