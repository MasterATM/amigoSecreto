# Matching — send & resend

## What to build

Send the matching to all participants via email, and support resending to individual participants. Once sent, the exchange is locked.

**Backend:**
- `POST /exchanges/:id/matching/send` — send matching to all participants
  - Requires an existing matching (generate first)
  - Sends email to each participant with their match
  - Changes exchange status from `draft` to `sent`
  - Once sent, the exchange cannot be modified (no more generate, re-roll, participant changes, forced edge changes)
- `POST /exchanges/:id/matching/resend/:personId` — resend matching email to a specific participant
  - Only works when exchange is `sent`
  - Does NOT change the exchange status or re-generate the matching
- SMTP email delivery via Spring Boot's `JavaMailSender`
- Email template: exchange name, "You are buying for: [Name]", budget (if set), exchange date (if set)
- Environment variables for SMTP config (`spring.mail.*`)

**Frontend:**
- "Send matching" button on exchange detail page (only visible in draft status)
- After sending, exchange status changes to `sent` and modify buttons are disabled
- "Resend" button per participant (only visible in sent status)
- Confirmation dialog before sending
- All state managed with Angular signals

## Acceptance criteria

- [ ] `POST /matching/send` sends emails to all participants
- [ ] Email contains: exchange name, match, budget (if set), date (if set)
- [ ] Exchange status changes to `sent` after sending
- [ ] After sending, all modify endpoints return 409 (conflict)
- [ ] `POST /matching/resend/:personId` resends only to that participant
- [ ] SMTP configuration via environment variables
- [ ] Angular "Send matching" button with confirmation dialog
- [ ] After sending, modify UI is disabled
- [ ] "Resend" button per participant in sent state
- [ ] Signal-based state management
- [ ] JUnit 5 tests for email sending (with test SMTP or mock)
- [ ] JUnit 5 tests for state transition (draft → sent is one-way)
- [ ] Vitest tests for send/resend UI components

## Blocked by

- #7 — Matching generate & re-roll
