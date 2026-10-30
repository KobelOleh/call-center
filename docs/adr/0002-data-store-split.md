---
status: accepted
---

# Data store split: PostgreSQL for durable business data, MongoDB for transient Job results, Redis for queues and caches

Licensing and call-center keep their durable data in PostgreSQL, including Transcripts (Segments as rows or JSONB, searchable with full-text search) so deleting a Call is one transaction. Transcribing keeps Job results in MongoDB with a 7-day TTL index, because their shape varies by AI provider and they must expire. Redis holds the Job queue, the entitlement cache and rate limiting.

## Considered Options

- **Transcripts in MongoDB in call-center.** Segments are naturally nested documents, but it splits Call deletion across two stores and weakens text search, for a second database to run. Rejected on technical grounds; choosing it would have been mainly for learning.
- **Everything in PostgreSQL.** Simplest to operate, but would leave the TTL and variable-shape results without the store that suits them, and one goal of the project is to use each technology where it is a strong fit.
