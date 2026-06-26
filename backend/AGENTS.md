# Backend Agent (Express)

## Scope

Owns all Express server behavior.

---

## Responsibilities

* API routes
* Middleware
* Authentication logic (if applicable)
* Request validation
* Service layer logic
* Database access patterns

---

## Architecture Rules

* Routes must stay thin
* Business logic must live in services
* Middleware must be reusable and composable
* Avoid mixing HTTP logic with domain logic

---

## Folder Expectations (if applicable)

* routes/
* services/
* middleware/
* utils/

---

## API Design Rules

* Keep endpoints predictable and resource-oriented
* Avoid excessive nesting in routes
* Follow the shared refactor rules for code shape and expression style
* Design endpoints to support the repo contract optimization rules for top-to-bottom rendering priority
* Expose lightweight, purpose-built requests when specific UI regions need faster delivery than broader shared payloads
* Keep request and response naming aligned with frontend camelCase usage so payload destructuring stays simple across the contract

---

## Feature Change Strategy

* When changing a feature, prefer extending an existing supported endpoint in a backward-compatible way first if the endpoint name still makes intuitive sense
* Extending an existing endpoint is preferred only when the added response or request handling would not create noticeable perceived latency for low-latency UI surfaces such as top-of-screen home components
* Optional params and falsy-default behavior can be used to extend existing endpoints safely when that does not create confusing or breaking behavior
* If the latency increase or payload growth would be noticeable, create a new endpoint instead of overloading the existing one
* If a feature requires splitting requests apart or dropping unnecessary data in a way that noticeably improves latency, the previous broader endpoint should be considered for legacy support and the new focused endpoints should be added
* Never repurpose an existing endpoint in a way that would break older still-supported frontend versions
* Additive changes are acceptable within the same major version, but removing data or behavior requires a major version update
* Only move behavior into legacy or deprecation when the current frontend no longer uses it and deprecation is explicitly approved
* If a function or route already moved into legacy is used again by the current frontend within the same major version, move that route or function back into latest support and update its tests accordingly

---

## Validation

* All inputs must be validated at boundary
* Never trust client input
* Validation errors must be structured and consistent
* Move safe environment-specific backend config, such as port numbers, into development env files instead of hardcoding them

---

## Error Handling

* Centralized error handler required
* No unhandled promise rejections
* Standardize error response format

---

## Imports

* Prefer absolute imports from backend package aliases whenever possible
* Keep alias paths stable and domain-oriented
* Use relative imports only when an alias would make the code less clear

---

## Version Compatibility

* Do not remove support for older app versions unless explicitly told to deprecate them
* When behavior depends on app version, make the version check clear and intentional
* Move older-version-exclusive backend logic into clearly labeled sections or dedicated files when it is no longer part of the latest app path
* When endpoints are formally deprecated, increment the backend major version in `backend/package.json`
* When a new backend major version becomes current, move the previous current endpoint version into legacy support if it still needs to work
* When a version is deprecated and support is intentionally removed, the deprecated version endpoints should no longer work and should be replaced by the new version number in the active app path
* A function or route should move into legacy support when the current frontend no longer uses it but older supported frontends may still rely on it
* When functions or routes move into legacy support because current frontends no longer use them, they should emit clear deprecation warnings while continuing to work until deprecation is explicitly approved
* Before the frontend minimum supported API version is incremented, the backend must pass tests confirming it still supports every API request used by the current frontend
