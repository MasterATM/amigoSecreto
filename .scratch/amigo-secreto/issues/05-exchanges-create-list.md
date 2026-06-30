# Exchanges — create & list

## What to build

Create and list exchanges. An exchange is a Secret Santa event defined by a name (not unique), an optional date, and an optional budget.

**Backend:**
- JPA entity `Exchange` with fields: id, name, date (optional), budget (optional), status (`draft` | `sent`)
- REST endpoints: `GET /exchanges`, `POST /exchanges`, `GET /exchanges/:id`, `PUT /exchanges/:id`, `DELETE /exchanges/:id`
- Exchange status defaults to `draft`
- Hard delete (no soft delete)
- Exchange name does not need to be unique
- Repository with `findById`, `findAll`, `save`, `deleteById`

**Frontend:**
- Exchange list page showing all exchanges (name, date, budget, status)
- "Create exchange" form (name required, date optional, budget optional)
- Edit exchange details (name, date, budget) while in draft status
- Delete exchange with confirmation
- All state managed with Angular signals

## Acceptance criteria

- [ ] `GET /exchanges` returns all exchanges
- [ ] `POST /exchanges` creates an exchange with `draft` status
- [ ] `GET /exchanges/:id` returns exchange details
- [ ] `PUT /exchanges/:id` updates name, date, or budget
- [ ] `DELETE /exchanges/:id` permanently removes the exchange
- [ ] Exchange name is not validated for uniqueness
- [ ] Angular exchange list page renders all exchanges
- [ ] Create/edit/delete forms work correctly
- [ ] Signal-based state management
- [ ] JUnit 5 tests for Exchange entity, repository, service, controller
- [ ] Vitest tests for exchange list component

## Blocked by

- #4 — Registry CRUD
