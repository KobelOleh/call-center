---
status: accepted
---

# The code is built on best practices and stays easy to grow

Everything in this project follows current best practice and is built so that adding a feature means adding code, not rewriting code. This applies to architecture, tests, data, naming and documentation alike. The principles are SOLID, KISS, DRY and YAGNI: use them to choose between designs, and do not build structure that no behaviour needs yet.

The Licensing service is organised by feature, with one Nest module per area (users, companies, licences, invitations, later access decisions):

- **Controller.** Handles HTTP only: reads the request, calls one service method, shapes the response. No business rules and no database calls.
- **Service.** One class per area holds that area's business rules and its database transactions. Prisma is used inside services. A separate repository layer is added only when a second data source or a real need for it appears.
- **DTO.** Every request body is a class with validation rules. A body that breaks them is answered with `400`. Normalisation that belongs to a value (an email is trimmed and lowercased) lives in one shared decorator, not in each service.
- **Domain errors.** A rule that is broken throws a `DomainError` with a code such as `NoFreeSeat`. It knows nothing about HTTP. One filter turns each code into a status and the body `{ code }`. A new rule adds one line to that table.
- **Acting User.** The caller is read in one place, the `ActingUser` parameter decorator. When real login replaces the `x-user-id` stand-in, only that decorator changes.
- **Shared code.** Code used by more than one area lives in `src/common`. Code used by one area stays in that area.

## Consequences

- Tests stay at the HTTP seam, so restructuring never needs a test change.
- A new area is a new folder with its module, controller, service and DTOs, registered in `AppModule`.
- Request validation uses `class-validator` and `class-transformer`, the libraries Nest's own validation pipe is built on.
- Anything not covered by this ADR is decided with the user and written down before it is built.
