---
status: accepted
---

# Call-center and transcribing integrate by presigned link, idempotent Job and signed webhook

Call-center never sends audio bytes to transcribing. It sends a Job with a short-lived, read-only Audio Link (a presigned S3 URL) and a Reference; transcribing downloads straight from S3 and returns the result by signed webhook with retries, with a status endpoint as fallback. Creating a Job is idempotent per Service Client and Reference. Transcribing has no tenant logic: call-center obtains the Access Decision from Licensing and reports minutes used to Licensing after a Transcription Completes.

## Considered Options

- **Upload the audio to transcribing directly.** Simpler to picture, but moves large files through two services and gives transcribing storage and retention duties.
- **Call-center polls for results.** Simpler to build, but wastes requests and delays results; kept only as the fallback.
- **Transcribing checks the licence itself.** Would force it to know about Companies and add a second caller of Licensing on the hot path.

## Consequences

- Call-center needs a durable outbox so a Transcription can be accepted while transcribing is down.
- Webhook receivers must verify the signature and tolerate duplicates and out-of-order delivery.
- Transcribing trusts call-center to have checked access.
