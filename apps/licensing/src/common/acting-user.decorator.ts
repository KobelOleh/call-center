import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

/** The id of the User making the call. Stand-in until login is designed: it comes from the `x-user-id` header. */
export const ActingUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => context.switchToHttp().getRequest<Request>().headers['x-user-id'] as string,
);
