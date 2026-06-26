# Backend ☕ Express

The backend is a lightweight Express 5 service that supports the Expo frontend with predictable JSON responses, version-aware compatibility rules, and internal alias-based imports. ☕

## Runtime

* `pnpm`
* `Node.js 26.x`

## Install And Run

```bash
pnpm install
pnpm dev
```

Useful commands:

```bash
pnpm start
pnpm dev
pnpm lint
pnpm lint:fix
pnpm test:api
pnpm test:api:frontend
pnpm test:api:latest
pnpm test:api:legacy
pnpm test:api:deprecated
```

`pnpm dev` runs the backend in watch mode so server changes restart automatically during development.

## Environment

Development config lives in `backend/.env.development`.

Current safe config:

```env
PORT=3001
```

`src/server.ts` loads that file before starting the app.

## Routes

Current starter routes:

* `GET /health`
* `GET /`
* `POST /`
* `PUT /`
* `DELETE /`
* `GET|POST|PUT|DELETE /api/v1/resource`

The CRUD handlers are still stubbed against an in-memory store, so this is scaffolding rather than finished domain logic.

`/health` is a stable root-level operational endpoint. `/api/v1/*` is the current explicit application API contract.

## API Testing ☕

API compatibility tests are organized into three categories:

* latest API request tests should work
* legacy API request tests should work
* deprecated API request tests should not work

These tests live under `tests/api/` and are runnable by humans or CI with the same commands:

```bash
pnpm test:api
pnpm test:api:frontend
pnpm test:api:latest
pnpm test:api:legacy
pnpm test:api:deprecated
```

Right now only the latest `v1` category has concrete request coverage. Legacy and deprecated test files remain in place as empty placeholders until older supported or deprecated API versions actually exist.

`test:api:frontend` is the major-version upgrade gate for the current app: it checks that the backend still supports every API request the current frontend actually uses. If those checks pass, the frontend minimum supported API version can be raised.

The repo’s API-testing subagent guidance lives in `tests/api/AGENTS.md`.

## Backend Rules Snapshot ☕️

This app is guided by `AGENTS.md`, `backend/AGENTS.md`, and `backend/tests/api/AGENTS.md`.

Important expectations:

* keep routes thin and move domain logic out of HTTP handlers
* support older app versions until deprecation is explicitly approved
* isolate older-version-exclusive logic into clear sections or dedicated files
* expose lightweight, purpose-built endpoints when UI placement requires faster or smaller payloads
* keep frontend/backend field names aligned in camelCase for easier destructuring
* preserve backward compatibility when the frontend contract evolves

## Imports

The backend uses package import aliases from `package.json`, including:

* `#app`
* `#routes`
* `#controllers/*`
* `#middleware/*`
* `#data/*`
* `#utils/*`

Use those aliases wherever they keep module intent clearer than relative paths.

## Where To Look Next

* `src/server.ts` for bootstrapping
* `src/app.ts` for middleware and route wiring
* `src/routes/` for endpoint registration
* `src/controllers/` for request handlers
* `AGENTS.md` and `backend/AGENTS.md` for the detailed backend rules
