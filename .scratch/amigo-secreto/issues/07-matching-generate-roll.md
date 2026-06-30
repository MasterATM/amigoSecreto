# Matching — generate & re-roll

## What to build

Generate and re-roll random single-cycle matchings for an exchange. The matching algorithm produces a single cycle where each participant gives exactly one gift and receives exactly one gift.

**Backend:**
- `POST /exchanges/:id/matching/generate` — generate a new matching
- `POST /exchanges/:id/matching/re-roll` — re-roll the current matching (same effect as generate)
- Matching algorithm:
  - If forced edges exist: build a partial path from forced edges, fill remaining participants into the cycle
  - If no forced edges: shuffle participants, form one cycle (person[0]→person[1]→...→person[N-1]→person[0])
  - If shuffle produces a self-gift (person lands next to themselves), re-shuffle
- Minimum 3 participants enforced
- Matching is returned in the response but NOT persisted as part of the exchange
- Exchange must be in `draft` status to generate/re-roll

**Frontend:**
- "Generate matching" button on exchange detail page
- Matching table displayed after generation (giver → receiver)
- "Re-roll" button to generate a new matching
- Matching table shows all pairs in the cycle
- All state managed with Angular signals

## Acceptance criteria

- [ ] `POST /matching/generate` returns a valid single-cycle matching
- [ ] `POST /matching/re-roll` returns a new random matching
- [ ] Matching respects forced edges (forced edges appear in the cycle)
- [ ] No self-gifts in the matching
- [ ] Each participant appears exactly once as giver and once as receiver
- [ ] Minimum 3 participants enforced (400 if fewer)
- [ ] Angular matching table displays correctly
- [ ] Generate and re-roll buttons work
- [ ] Signal-based state management
- [ ] JUnit 5 tests for matching algorithm (pure function tests)
- [ ] JUnit 5 tests for forced-edge integration with matching

## Blocked by

- #6 — Exchanges participants & forced edges
