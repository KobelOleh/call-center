# Settled rules and settings from the grilling

Rules and numbers agreed during `/grill-with-docs` that are not glossary terms or ADRs. Use them as input for `/to-spec`. Numbers are settings, not domain rules.

## Licensing
- Users log in as a person; the first User to create a Company becomes its first Company Admin. More admins are allowed; the last admin cannot be removed or demoted.
- People join only through an Invitation from a Company Admin. Inviting an Operator or Manager needs a free Seat, held until accepted, declined or expired.
- Operators and Managers take a Seat; a Company Admin takes none. A person holds at most one Seat. A Company may have several Licences on different Tariff Plans, or none.
- Usage Allowance: one limit for now, transcription minutes per Licence per month. Call-center reports minutes used after a Transcription Completes, idempotently.
- Grace Period: 3 days after payment fails or a Licence is cancelled, then access is denied; data is kept.
- Access Decision: allow, or deny with a reason (NoSeat, LicenceLapsed, PlanLacksFeature, RoleLacksPermission, AllowanceExhausted). Proposed check order is in `apps/licensing/docs/domain-model.md`.
- Stripe: Checkout for purchase; webhooks drive Licence state. See licensing ADR 0001.

## Call center
- No live telephony: a Call is created by uploading a Recording with details. One Recording per Call.
- Recording limits: MP3 or WAV, max 60 minutes, max 100 MB.
- Operators see their own Calls; Managers and Company Admins see all Calls in the Company. No Teams yet.
- Transcription is on demand only, by anyone who can see the Call and whose Role has the transcription Permission.
- Guard rails: one active Transcription per Call; at most 3 attempts per Call, then a Company Admin must step in; Company-wide rate limit; Usage Allowance checked before accepting, minutes consumed only on Completed. A failed attempt consumes no minutes.
- At most one Transcript per Call; re-transcription after success is a future feature, so keep each attempt as its own Transcription record.
- If transcribing is down, accept the request as Requested and deliver later (outbox).
- Deleting: see ADR 0003. Operators cannot delete.

## Transcribing
- Retries: up to 3 automatic tries with a short backoff (a few seconds) for temporary failures; permanent failures fail at once.
- Failure Reasons are a small fixed set; raw provider errors go to logs only.
- Audio Link lifetime about 1 hour; on `AudioLinkExpired` call-center reissues a link and resubmits without counting a user attempt.
- Stuck Jobs: 2-minute heartbeat timeout plus a 30-minute hard cap, then treated as `Timeout` and retried.
- Job creation is idempotent per Service Client and Reference.
- Two-channel Recordings give Operator and Caller labels; mono gives generic speaker labels and the Transcript records which kind it was.
- Job results live 7 days in MongoDB (TTL).

## Not yet decided (implementation)
AI provider, auth token lifetimes, AWS deployment target, monorepo tooling details.
