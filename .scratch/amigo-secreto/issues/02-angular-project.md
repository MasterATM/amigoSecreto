# Set up Angular project

## What to build

Create the Angular frontend project with the correct structure and tooling.

- Angular 22.0.3 with standalone components and signals
- **Vitest** as the unit testing framework
- **Playwright** as the E2E testing framework
- Angular Router for navigation
- Angular HTTP client for API communication
- TypeScript strict mode
- Component structure for: login page, registry page, exchange list page, exchange detail page
- Interceptor for authentication token handling

## Acceptance criteria

- [ ] `ng test` passes with Vitest
- [ ] Playwright is configured and `npx playwright test` passes with a basic smoke test
- [ ] Standalone components (no NgModules)
- [ ] Signals used for state management
- [ ] Router configured with routes for login, registry, exchanges
- [ ] HTTP interceptor for auth token
- [ ] Basic component structure in place

## Blocked by

- #12 — Set up monorepo structure
