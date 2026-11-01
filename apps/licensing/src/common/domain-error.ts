export type DomainErrorCode = 'LastCompanyAdmin' | 'NoFreeSeat' | 'InvitationInvalid';

/** A broken business rule. It knows nothing about HTTP; the DomainErrorFilter maps its code to a status. */
export class DomainError extends Error {
  constructor(readonly code: DomainErrorCode) {
    super(code);
  }
}
