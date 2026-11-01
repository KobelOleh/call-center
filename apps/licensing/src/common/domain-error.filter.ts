import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import { DomainError, DomainErrorCode } from './domain-error.js';

const statusByCode: Record<DomainErrorCode, number> = {
  LastCompanyAdmin: 409,
  NoFreeSeat: 409,
  InvitationInvalid: 404,
};

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    host.switchToHttp().getResponse<Response>().status(statusByCode[error.code]).json({ code: error.code });
  }
}
