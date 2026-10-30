---
status: accepted
---

# Roles, Tariff Plans and Features are data, not hard-coded enums

Roles, Permissions, Tariff Plans and Features are stored as rows with stable keys and are not TypeScript enums or `if (plan === 'pro')` branches. Adding a Role (the set is expected to grow beyond Company Admin, Manager and Operator) or a new Tariff Plan is then a data change, and code only ever asks whether a Role has a Permission or a Plan includes a Feature.

## Consequences

- Callers must never branch on a Role or Tariff Plan name; they ask for an Access Decision about a Feature.
- Stable keys are a contract with the other services, so a key can be added but should not be renamed or reused.
- This costs a bit of indirection now (a catalog and seed data) in exchange for no code changes when the catalog grows.
