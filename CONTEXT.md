# AmigoSecreto

A Secret Santa gift exchange organizer. An organizer sets up exchanges, manages a registry of people, and produces random cycle-based matchings.

## Language

**Organizer**:
The single privileged user who creates and manages exchanges and the participant registry. Avoid: admin, host, coordinator
**Registry**:
A persistent collection of people (name + email) that the organizer maintains across exchanges. Avoid: contacts, people list, address book
**Participant**:
A person selected from the registry to take part in a specific exchange. Avoid: person, user, invitee
**Exchange**:
A single Secret Santa event defined by a name (not unique), an optional date, and an optional budget. Multiple exchanges can share the same name. Deleted exchanges are permanently removed (hard delete). Avoid: event, draw, game
**Matching**:
A random single cycle covering all participants in the exchange. Implemented as: shuffle participants, form one cycle. Each participant gives exactly one gift and receives exactly one gift. No person gives to themselves. Minimum 3 participants. Avoid: pairing, assignment, draw result
**Forced Edge**:
An organizer-specified constraint that a particular participant must give to a particular other participant. Validated: no self-gifts, at most one forced outgoing/incoming edge per participant, forced edges must not form a proper sub-cycle, forced edges must be completable into a single cycle. Avoid: rule, constraint, exception
