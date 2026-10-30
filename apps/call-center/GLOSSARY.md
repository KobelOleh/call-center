# Call center

The product Operators and Managers use: it holds a Company's Calls and their Recordings, and lets people request transcriptions. Company, User, Role, Operator, Manager, Licence and Seat are defined in the Licensing glossary and used here as-is.

## Language

**Call**:
One phone conversation between a Caller and an Operator, recorded in the system with its details (who, when, direction). An Operator sees their own Calls; Managers and Company Admins see all Calls of their Company.
_Avoid_: Conversation, Ticket, Case

**Caller**:
The person on the other end of a Call, who phoned the Company or was phoned by an Operator.
_Avoid_: Customer, Client, Contact

**Recording**:
The audio of a Call. A Call has exactly one Recording.
_Avoid_: Audio, File, Attachment

**Transcription**:
A request to turn a Call's Recording into text, together with its progress: Requested, Processing, then Completed or Failed. A Failed Transcription carries a reason the user can understand.
_Avoid_: Job, Task, Conversion

**Transcript**:
The written result of a Completed Transcription: an ordered list of Segments plus the detected language. A Call has at most one Transcript.
_Avoid_: Text, Captions, Notes

**Deleted Call**:
A Call that a Manager or Company Admin removed. It is hidden and can be restored for 30 days, then purged. Operators cannot delete.
_Avoid_: Archived Call, Trashed Call

**Purge**:
The permanent removal of a Deleted Call and everything derived from it (Recording, Transcript) from every store, once its 30 days have passed.
_Avoid_: Hard delete, Cleanup

**Audit Record**:
A permanent note of who deleted or restored a Call, and when.
_Avoid_: Log entry, History

**Segment**:
One stretch of a Transcript spoken by one speaker, with start time, end time and text. The speaker is Operator or Caller for a two-channel Recording, and a generic "Speaker 1" or "Speaker 2" for a mono Recording.
_Avoid_: Line, Utterance, Chunk
