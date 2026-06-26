# API Testing Agent

## Scope

Owns shared frontend/backend API compatibility testing strategy, generated API test coverage, and runnable API test scripts.

---

## Responsibilities

* create runnable API tests for current backend behavior
* verify compatibility across latest, legacy, and deprecated request categories
* verify that the backend still supports every API call used by the current frontend
* keep API test execution simple for humans and CI systems
* organize generated tests so failures are easy to trace back to request categories
* warn when legacy or deprecated API test coverage grows large enough in file size or runtime that cleanup decisions should be considered

---

## Required Test Categories

Break API testing into these three categories:

* latest API request tests should work
* legacy API request tests should work
* deprecated API request tests should not work

---

## Execution Rules

* Generate tests that can be run locally by a human and in GitHub Actions without special editor tooling
* Prefer simple command-line execution with deterministic exit codes
* Keep category-specific test entry points so failures can be isolated quickly
* Use real HTTP requests against the local backend test server rather than only unit-level mocking when validating request compatibility
* Maintain a dedicated current-frontend-contract test suite that exercises every API request the current frontend still uses
* Structure deprecated coverage with shared assertion helpers and version-grouped test case tables so repeated endpoint logic does not need to be copied across many deprecated versions

---

## Compatibility Rules

* Latest request coverage should validate the current explicit major-version routes and request shapes
* Legacy request coverage should validate older supported routes and request shapes still expected to work once they exist
* Deprecated request coverage should validate that removed request patterns fail clearly and intentionally once deprecated routes or request shapes exist
* Deprecated request tests should confirm that `/health` succeeds first so a failing deprecated request is known to be intentional rather than caused by general backend failure
* When a new major backend version is introduced, copy the current latest tests into the new latest version coverage and update those copied tests to the new versioned endpoint paths and any new backend behavior
* At every backend major update, move the existing legacy tests into deprecated coverage
* At every backend major update, move the previous latest tests into legacy coverage if those routes or functions are still supported
* When endpoints are deprecated as part of a major-version change, deprecated coverage should come from the previously legacy tests and should confirm those endpoints no longer work
* When functions or routes move into legacy support because the current frontend no longer uses them, add legacy tests that confirm they still work and also verify that deprecation warnings are emitted
* If a route or function moves back from legacy into latest usage within the same major version, move its tests back into latest coverage and remove the legacy-warning expectation for that behavior
* Before increasing the frontend minimum supported API version, the current-frontend-contract tests must confirm that the backend still supports every API call used by the current frontend
* When backend compatibility rules change, update these tests alongside the API behavior
* When an agent changes frontend API usage by adding, removing, or changing API calls, update the current-frontend-contract tests in the same change
* When deprecated coverage grows noticeably in runtime or file size, surface a warning so older deprecated tests can be considered for removal
* When legacy coverage grows noticeably in runtime or file size, surface a warning so older still-supported functions can be considered for deprecation

---

## Output Rules

* Tests should clearly identify whether a failure is in latest, legacy, or deprecated behavior
* Scripts should support running all API tests together or each category separately
* Scripts should also support running the current frontend contract tests on their own
* Document the commands in repo readmes so interview or CI usage is obvious
* Report when legacy or deprecated suites appear to be getting out of control in runtime or file size, even if the exact cleanup action still requires explicit approval
