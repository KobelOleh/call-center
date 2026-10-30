---
status: proposed
---

# Services are TypeScript on Node with NestJS and Prisma, in a pnpm workspace

All backend services (licensing, call-center, transcribing) are written in TypeScript on Node with NestJS. PostgreSQL access goes through Prisma, with migrations managed by Prisma Migrate. The repository is a pnpm workspace with one package per service under `apps/`. Tests run against a real PostgreSQL started with Testcontainers and call the service through its HTTP API.

## Considered Options

- **Drizzle instead of Prisma.** Closer to SQL and lighter, but Prisma's schema file and generated client give a clearer single source for the data model, which suits a project that is also a learning exercise.
- **Plain Express or Fastify.** Less ceremony, but each service would reinvent module structure, validation, configuration and job scheduling that NestJS provides consistently.
- **Next.js for the frontend, or a shared full-stack framework.** Not needed: the product is an authenticated tool with no SEO need, and Next would add a second server layer beside NestJS. The frontend choice is deferred until a slice needs a UI; plain React is the default.

## Consequences

- Operations that need row locks, such as taking the last free Seat, use a transaction with raw SQL (`SELECT ... FOR UPDATE`) because Prisma's query API does not expose locking.
- Time-dependent rules (Grace Period, Invitation expiry) read the time from an injectable clock so tests can control it.
- Stable keys for Roles, Permissions, Features and Tariff Plans stay data in the database (licensing ADR 0002), loaded by seed scripts.
- Turborepo or similar build tooling is not adopted yet; add it only if builds become slow.
