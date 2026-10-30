---
status: accepted
---

# Deleting a Call is a soft delete followed by a purge after 30 days

Only Managers and Company Admins can delete a Call. It becomes a Deleted Call, hidden but restorable for 30 days, and each delete and restore leaves an Audit Record. After 30 days a purge job permanently removes the Call, Recording and Transcript from every store in call-center. Transcribing's copies need no delete call because its Job results expire by TTL after 7 days.

## Consequences

- Queries must exclude Deleted Calls by default.
- The purge must remove the S3 object and the database rows, and be safe to re-run if it fails midway.
- Audit Records outlive the Call they describe, so they must not hold personal content from the Recording.
