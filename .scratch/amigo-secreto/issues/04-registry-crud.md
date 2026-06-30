# Registry — CRUD

## What to build

Full CRUD for the participant registry. The registry is a persistent collection of people (name + email) that the organizer manages across exchanges.

**Backend:**
- JPA entity `Person` with fields: id, name, email
- REST endpoints: `GET /people`, `POST /people`, `PUT /people/:id`, `DELETE /people/:id`
- Email validation
- No relationship to exchanges (people exist independently)
- Repository with `findById`, `findAll`, `save`, `deleteById`

**Frontend:**
- Registry page listing all people in a table
- "Add person" form (name + email) with validation
- Edit person inline or via modal
- Delete person with confirmation
- All state managed with Angular signals

## Acceptance criteria

- [ ] `GET /people` returns all people
- [ ] `POST /people` creates a person, validates email format
- [ ] `PUT /people/:id` edits name and/or email
- [ ] `DELETE /people/:id` removes a person
- [ ] Angular registry page renders people in a table
- [ ] Add/edit/delete forms work with validation
- [ ] Signal-based state management
- [ ] JUnit 5 tests for Person entity, repository, service, controller
- [ ] Vitest tests for registry component

## Blocked by

- #12 — Set up monorepo structure
- #4 — Set up Spring Boot project
