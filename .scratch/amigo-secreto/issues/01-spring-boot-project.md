# Set up Spring Boot project

## What to build

Create the Spring Boot backend project with the correct structure for a monorepo containing both Angular and Spring Boot.

- Maven multi-module project with two modules: `amigo-secreto-core` (pure Java domain logic, no Spring dependencies) and `amigo-secreto-api` (Spring Boot layer with REST controllers, JPA, SMTP, authentication)
- Spring Boot 4.1.0 with Java 17+
- SQLite database via Spring Data JPA (`org.xerial:sqlite-jdbc` driver)
- JUnit 5 for testing
- Maven parent POM with dependency management
- Package structure: `core` has domain models, matching algorithm, forced-edge validation. `api` has controllers, repositories, email service, auth

## Acceptance criteria

- [ ] `mvn clean install` passes with no errors
- [ ] Two modules: `amigo-secreto-core` and `amigo-secreto-api`
- [ ] `core` has zero Spring dependencies (pure Java)
- [ ] `api` depends on `core`
- [ ] SQLite driver configured in `api` module
- [ ] JUnit 5 test passes in each module
- [ ] Package structure matches the description above

## Blocked by

- #12 — Set up monorepo structure
