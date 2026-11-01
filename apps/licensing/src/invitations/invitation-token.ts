import { createHash, randomBytes } from 'node:crypto';

/** A secret with 256 bits of randomness, sent to the invited person. Only its hash is stored. */
export const newInvitationToken = () => randomBytes(32).toString('base64url');

export const hashInvitationToken = (token: string) => createHash('sha256').update(token).digest('hex');
