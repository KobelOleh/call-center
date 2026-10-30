---
status: accepted
---

# A Licence is one Stripe subscription, with Seat count as quantity

Each Licence maps to exactly one Stripe subscription, and the number of Seats is that subscription's quantity. Stripe is the source of truth for payment state; Licensing only mirrors it from webhooks and never charges anyone itself, so Seat changes and lapses (see Grace Period) flow from Stripe to Licensing, never the other way.

## Considered Options

- **One Stripe subscription per Company, with a line item per Licence.** Fewer Stripe objects, but a failed payment on one Licence would affect the whole Company's subscription state, and the mapping from Stripe events to a single Licence becomes indirect.
- **Licensing tracks Seats itself and tells Stripe the total.** Gives full control, but makes Licensing a second source of truth for billing and invites drift.

## Consequences

- Buying or changing a Licence always goes through Stripe Checkout or the customer portal.
- Webhook handling must be idempotent and tolerate out-of-order delivery, because it is the only path by which a Licence changes.
- A Company with Licences on different Tariff Plans has several Stripe subscriptions.
