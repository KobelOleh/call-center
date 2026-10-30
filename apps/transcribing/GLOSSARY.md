# Transcribing

A small capability service: it receives a link to audio from a registered Service Client, turns it into a Transcript with an AI model, and delivers the result back. It knows nothing about Companies, Users or Licences. Service Client is defined in the Licensing glossary; Transcript and Segment mean the same as in the Call center glossary.

## Language

**Job**:
One unit of work: transcribe one piece of audio for one Service Client. It moves through Requested, Processing, then Completed or Failed. This is what the Call center calls a Transcription.
_Avoid_: Task, Request, Transcription

**Reference**:
An opaque identifier supplied by the Service Client when it creates a Job and returned unchanged with the result, so the caller can match the result to its own record.
_Avoid_: Correlation id, Tag

**Failure Reason**:
One of a small fixed set of codes explaining why a Job Failed (for example unreadable audio, expired Audio Link, provider unavailable, timeout, too long). Never the AI provider's raw error.
_Avoid_: Error message, Error code

**Audio Link**:
A short-lived, read-only link to the audio, supplied with a Job. The service never stores the audio permanently and holds no standing access to the owner's storage.
_Avoid_: Upload, File URL
