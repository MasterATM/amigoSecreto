# Set up monorepo structure

## What to build

Create the monorepo directory structure for Angular and Spring Boot. Both live in this repo as sibling directories, each with its own build system.

- Create `spring-boot/` directory with a `README.md` explaining it's the Spring Boot backend
- Create `angular/` directory with a `README.md` explaining it's the Angular frontend
- Move any existing root-level config files that belong to one or the other into their respective directories
- The root of the repo should only contain:
  - `.sandcastle/` — sandcastle configuration
  - `docs/` — documentation (PRD, ADRs, agents config)
  - `.scratch/` — issue files
  - `.agents/` — agent skills
  - `CLAUDE.md` — agent configuration
  - `CONTEXT.md` — domain glossary
  - `package.json` — root package.json for shared scripts (optional, can be added later)

## Acceptance criteria

- [ ] `spring-boot/` directory exists with a README
- [ ] `angular/` directory exists with a README
- [ ] Root repo contains only shared files (docs, sandcastle, config)
- [ ] No Spring Boot files in the repo root
- [ ] No Angular files in the repo root

## Blocked by

None - can start immediately
