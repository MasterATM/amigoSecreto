# AmigoSecreto PRD

## Problem Statement

The organizer runs Secret Santa gift exchanges (for office, family, or other groups) and needs a tool to:
1. Maintain a persistent registry of people (name + email) across exchanges
2. Create exchanges with participants selected from that registry
3. Generate random matchings where each person gives exactly one gift and receives exactly one gift
4. Communicate matchings to participants via email
5. Handle forced edges (e.g., "Alice must give to Bob") while validating constraints

No existing tool fits this specific workflow — the organizer has built ad-hoc implementations before and needs a proper, reusable system.

## Solution

A single-organizer web application that provides:
- A **registry** of people (name + email) managed by the organizer
- **Exchanges** (named events with optional date and budget) that pull participants from the registry
- A **matching engine** that generates random single-cycle matchings, supports forced edges, and validates all constraints
- **Email delivery** via SMTP to notify participants of their match
- A simple password-protected web UI for the organizer to manage everything

Participants never log in — they receive an email with their match and interact only through that channel.

## User Stories

1. As an **organizer**, I want to log in with a password, so that I can access the application securely
2. As an **organizer**, I want to see a list of all people in my registry, so that I can manage who is available for exchanges
3. As an **organizer**, I want to add a person (name + email) to the registry, so that they can be selected for future exchanges
4. As an **organizer**, I want to edit a person's name or email in the registry, so that I can keep the registry up to date
5. As an **organizer**, I want to delete a person from the registry, so that they are no longer available for selection
6. As an **organizer**, I want to create a new exchange with a name, an optional date, and an optional budget, so that I can set up a Secret Santa event
7. As an **organizer**, I want to select participants for an exchange from the registry, so that only the right people are in this exchange
8. As an **organizer**, I want to remove a participant from an exchange before it is sent, so that I can correct my selection
9. As an **organizer**, I want to add forced edges (e.g., "Alice gives to Bob") to an exchange, so that I can enforce specific pairings
10. As an **organizer**, I want the system to validate forced edges (no self-gifts, at most one forced outgoing/incoming edge per participant, no proper sub-cycles, completable into a single cycle), so that I don't create impossible constraints
11. As an **organizer**, I want to generate a random matching for an exchange, so that the gift-giving assignments are determined
12. As an **organizer**, I want to re-roll the matching as many times as I want while the exchange is in draft status, so that I can find a matching I'm happy with
13. As an **organizer**, I want to view the full matching table before sending, so that I can review all assignments
14. As an **organizer**, I want to send the matching to all participants with one click, so that the exchange goes live
15. As an **organizer**, I want each participant to receive an email containing their match (who they are buying for), the exchange name, the budget (if set), and the exchange date (if set), so that they know what to do
16. As an **organizer**, I want to resend the matching email to a specific participant who says they didn't receive it, so that they can still participate
17. As an **organizer**, I want the matching to be locked once all emails have been sent, so that accidental changes are prevented
18. As an **organizer**, I want to create multiple exchanges simultaneously, so that I can run separate exchanges (e.g., office and family) at the same time
19. As an **organizer**, I want to delete an exchange permanently (hard delete), so that I can clean up old or unwanted exchanges
20. As an **organizer**, I want to view past exchanges, so that I can check who was in them (curiosity about past matches)
21. As an **organizer**, I want to create an exchange with as few as 3 participants, so that the minimum viable exchange is supported
22. As an **organizer**, I want to create an exchange with many participants (practically up to ~20), so that large groups are supported
23. As an **organizer**, I want the matching to be a single cycle where each participant gives exactly one gift and receives exactly one gift, so that the gift flow is fair and balanced
24. As an **organizer**, I want the matching to handle both even and odd participant counts without special cases, so that I don't need to worry about group size parity

## Implementation Decisions

### Architecture

- **Single-organizer app** with simple password authentication (password stored in environment variable `AMIGO_SECRETO_PASSWORD`)
- **Web UI** only — no mobile app, no exports, no participant login
- **SMTP email delivery** — configurable SMTP server via environment variables
- **Tech stack**: **Angular 22.0.3** (frontend, TypeScript, **Vitest** as the testing framework), **Spring Boot 4.1.0** (backend, Java, requires Java 17+, **JUnit 5** as the testing framework). Angular serves the web UI and communicates with the Spring Boot API via HTTP. Spring Boot handles all domain logic, persistence, SMTP email delivery, and session management. **SQLite** as the database — single file, zero admin, zero server. Spring Data JPA with the `org.xerial:sqlite-jdbc` driver.

### Modules

1. **Auth module** — password verification, session management (cookie-based)
2. **Registry module** — CRUD for people (name + email), no relationship to exchanges
3. **Exchange module** — create, read, update (before sent), delete exchanges; manage participant selection; manage forced edges
4. **Matching module** — generate random single-cycle matching, validate forced edges, re-roll
5. **Email module** — send emails via SMTP, track sent state per participant, resend capability
6. **UI module** — organizer-facing web pages for registry management, exchange creation/management, matching review

### Module Interfaces

- **Registry**: `add(name, email) → Person`, `edit(id, name?, email?)`, `remove(id)`, `list() → Person[]`, `findById(id)`
- **Exchange**: `create(name, date?, budget?) → Exchange`, `findById(id)`, `addParticipant(exchangeId, personId)`, `removeParticipant(exchangeId, personId)`, `addForcedEdge(exchangeId, fromPersonId, toPersonId)`, `removeForcedEdge(exchangeId, fromPersonId, toPersonId)`, `listByOrganizer() → Exchange[]`, `delete(id)`, `status: Draft | Sent`
- **Matching**: `generate(exchange) → Matching[]` (array of {giver, receiver} pairs forming one cycle), `validateForcedEdges(exchange) → ValidationError[]`, `reRoll(exchange) → Matching[]`
- **Email**: `sendMatching(exchangeId, matching) → void`, `resendToParticipant(exchangeId, participantId) → void`

### Data Model

- **Person**: `{ id, name, email }`
- **Exchange**: `{ id, name, date?, budget?, status: Draft | Sent, participants: PersonId[], forcedEdges: [{ from: PersonId, to: PersonId }] }`
- **Matching**: Array of `{ giver: PersonId, receiver: PersonId }` forming a single cycle

### Matching Algorithm

1. Validate forced edges (no self-gifts, at most one forced outgoing/incoming per person, no proper sub-cycles, completable)
2. If forced edges exist, build a partial path from them; fill remaining participants into the cycle
3. If no forced edges, shuffle participants and form one cycle: `shuffle → person[0]→person[1]→...→person[N-1]→person[0]`
4. If shuffle produces a self-gift (person lands next to themselves in the cycle), re-shuffle

### Email Template

Each email contains:
- Exchange name
- "You are buying for: [Name]"
- Budget (if set)
- Exchange date (if set)

### Storage

- **SQLite** via Spring Data JPA — the matching module is domain logic (pure Java services) and can be tested independently of the persistence layer
- Registry and exchange entities mapped with JPA/Hibernate

### REST API

All endpoints require authentication. The API follows RESTful conventions with `matching` as a sub-resource action on exchanges.

| Resource | Method | Path | Description |
|---|---|---|---|
| **Auth** | POST | `/auth/login` | Login with password |
| **People** | GET | `/people` | List all people |
| | POST | `/people` | Add person |
| | PUT | `/people/:id` | Edit person |
| | DELETE | `/people/:id` | Delete person |
| **Exchanges** | GET | `/exchanges` | List all exchanges |
| | POST | `/exchanges` | Create exchange |
| | GET | `/exchanges/:id` | Get exchange details |
| | PUT | `/exchanges/:id` | Update exchange (name, date, budget) |
| | DELETE | `/exchanges/:id` | Delete exchange |
| | POST | `/exchanges/:id/participants` | Add participant |
| | DELETE | `/exchanges/:id/participants/:personId` | Remove participant |
| | POST | `/exchanges/:id/forced-edges` | Add forced edge |
| | DELETE | `/exchanges/:id/forced-edges/:fromPersonId/:toPersonId` | Remove forced edge |
| **Matching** | POST | `/exchanges/:id/matching/generate` | Generate matching |
| | POST | `/exchanges/:id/matching/re-roll` | Re-roll matching |
| | POST | `/exchanges/:id/matching/send` | Send matching (locks exchange) |
| | POST | `/exchanges/:id/matching/resend/:personId` | Resend to specific person |

**Response shapes:**

- **Person**: `{ id, name, email }`
- **Exchange**: `{ id, name, date?, budget?, status: "draft" | "sent", participants: Person[], forcedEdges: [{ from: Person, to: Person }], matching?: Matching[] }`
- **Matching**: Array of `{ giver: Person, receiver: Person }`
- **Login response**: `{ token }` (session token)

### Spring Boot Module Structure

- **`amigo-secreto-core`** — pure Java domain logic (matching algorithm, forced-edge validation, state transitions). No Spring dependencies. Testable with JUnit 5.
- **`amigo-secreto-api`** — Spring Boot layer (REST controllers, JPA repositories, SMTP email service, authentication). Depends on `core`.

## Testing Decisions

### What makes a good test

- Test **domain logic in isolation** — the matching algorithm, forced-edge validation, and state transitions should be tested as pure Java functions with no I/O (JUnit 5)
- Test **external behavior** — email sending should be tested by verifying the email was sent (or that the correct email content was produced), not by inspecting SMTP internals
- Test **edge cases** — minimum participants (3), odd/even counts, forced edges that create valid and invalid configurations
- Test **Angular components** with Vitest — verify UI renders correctly, form validation works, and API calls are made

### Modules to test

1. **Matching module** (Java/core) — pure function tests for cycle generation, forced-edge validation, re-roll behavior (JUnit 5)
2. **State transitions** — draft → sent is one-way; re-roll only in draft; resend after sent (JUnit 5)
3. **Email module** — verify email content and recipient selection (JUnit 5 with test SMTP)
4. **Angular components** — UI interaction tests (Vitest)

### Prior art

- No existing tests in the codebase — this is a greenfield project

## Out of Scope

- Participant login or dashboard — participants receive emails only
- Google OAuth or other auth providers — simple password only
- SMS notifications
- Gift wishlists or preferences
- Automatic reminders before the exchange date
- Reusing or cloning a previous exchange
- Exporting matchings (CSV, PDF, print)
- Multiple organizers
- Soft delete or exchange recovery
- Reciprocal pair optimization — matching is a single random cycle
- Uniform distribution guarantee — any valid random cycle is acceptable
- Maximum participant limit enforcement — practical ceiling ~20, no hard cap

## Further Notes

- The matching module is the core domain logic and should be designed as a pure, testable seam — it takes an exchange (participants + forced edges) and returns a matching, with no side effects
- Email delivery is an infrastructure concern — the email module should be a thin wrapper around an SMTP client, easily swappable
- The web UI is the only user-facing surface — the organizer manages everything through it
- The registry is independent of exchanges — people exist regardless of which exchanges they're in
- The single-cycle matching model (ADR-0001) is a deliberate simplification over a general cycle-decomposition approach
