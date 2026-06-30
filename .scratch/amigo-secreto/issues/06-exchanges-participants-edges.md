# Exchanges — participants & forced edges

## What to build

Manage participants and forced edges within an exchange. Participants are selected from the registry. Forced edges are organizer-specified constraints (e.g., "Alice must give to Bob").

**Backend:**
- `POST /exchanges/:id/participants` — add a participant (person ID) to an exchange
- `DELETE /exchanges/:id/participants/:personId` — remove a participant
- `POST /exchanges/:id/forced-edges` — add a forced edge (`{ from: personId, to: personId }`)
- `DELETE /exchanges/:id/forced-edges/:fromPersonId/:toPersonId` — remove a forced edge
- Forced edge validation:
  - No self-gifts (from != to)
  - At most one forced outgoing edge per participant
  - At most one forced incoming edge per participant
  - No proper sub-cycles (forced edges must be completable into a single cycle)
- Validation errors return 400 with error details
- Exchange must be in `draft` status to modify participants/forced edges

**Frontend:**
- Exchange detail page showing:
  - Participant list (selectable from registry)
  - Forced edges list with add/remove controls
- "Add participant" dropdown from registry
- "Add forced edge" form (from → to)
- Validation error messages displayed inline
- All state managed with Angular signals

## Acceptance criteria

- [ ] Add/remove participants to/from an exchange
- [ ] Add/remove forced edges with validation
- [ ] Self-gift forced edges are rejected (400)
- [ ] Duplicate outgoing forced edges are rejected (400)
- [ ] Duplicate incoming forced edges are rejected (400)
- [ ] Sub-cycle forced edges are rejected (400)
- [ ] Cannot modify participants/forced edges when exchange is `sent`
- [ ] Angular exchange detail page shows participants and forced edges
- [ ] Validation errors displayed to user
- [ ] Signal-based state management
- [ ] JUnit 5 tests for forced-edge validation logic
- [ ] Vitest tests for exchange detail component

## Blocked by

- #5 — Exchanges create & list
