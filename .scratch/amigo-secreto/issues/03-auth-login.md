# Auth — login

## What to build

Password-based authentication for the single organizer. The organizer logs in with a password stored in the `AMIGO_SECRETO_PASSWORD` environment variable.

**Backend:**
- `/auth/login` POST endpoint accepting `{ password: string }`
- Password compared against `AMIGO_SECRETO_PASSWORD` env var
- Returns a session token on success
- Cookie-based session management

**Frontend:**
- Login page with a password form
- Form validation (required field)
- On success, store the session token and redirect to the exchanges list
- On failure, show an error message

## Acceptance criteria

- [ ] POST `/auth/login` with correct password returns a session token
- [ ] POST `/auth/login` with wrong password returns 401
- [ ] Angular login page renders with a password input
- [ ] Submitting wrong password shows an error message
- [ ] Submitting correct password redirects to exchanges list
- [ ] Session token is stored and included in subsequent API requests via interceptor
- [ ] JUnit 5 tests for auth service
- [ ] Vitest tests for login component

## Blocked by

- #12 — Set up monorepo structure
- #4 — Set up Spring Boot project
