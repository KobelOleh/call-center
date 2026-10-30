# Glossary Map

Each context owns its vocabulary. Read the glossary of every context relevant to the topic.

| Context | Path | Responsibility |
| --- | --- | --- |
| Call center | `apps/call-center/GLOSSARY.md` | Users, calls, recordings, transcript status, UI |
| Licensing | `apps/licensing/GLOSSARY.md` | Roles, tariff plans, entitlements, Stripe subscription state, OAuth2 clients |
| Transcribing | `apps/transcribing/GLOSSARY.md` | Transcription jobs, transcripts, AI transcriber |

## Relationships

- **Call center → Licensing**: asks for an Access Decision before accepting a Transcription, and reports minutes used after one Completes (idempotently). Call center stores only ids of Users and Companies.
- **Call center → Transcribing**: creates a Job with an Audio Link and a Reference. Transcribing returns the result by signed webhook, with a status endpoint as fallback. Transcription (Call center) = Job (Transcribing).
- **Transcribing → Licensing**: none beyond authenticating its callers as Service Clients.
- **Shared meaning**: Transcript and Segment mean the same in Call center and Transcribing. Company, User, Role, Operator, Manager, Licence and Seat are defined in Licensing and used as-is.

Glossaries are created lazily by `/domain-modeling` as terms are resolved.
