import { Injectable } from '@nestjs/common';
import { DomainError } from '../common/domain-error.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { InviteDto } from './invitation.dto.js';
import { hashInvitationToken, newInvitationToken } from './invitation-token.js';

@Injectable()
export class InvitationsService {
  constructor(private readonly db: PrismaService) {}

  /** Holds a free Seat of the Licence for the invited email. Returns the secret token (a stand-in until email is sent). */
  async invite(actingUserId: string, companyId: string, dto: InviteDto) {
    const admin = await this.db.user.findFirst({ where: { id: actingUserId, companyId, roleKey: 'company-admin' } });
    if (!admin) throw new DomainError('NotCompanyAdmin');
    const token = newInvitationToken();
    const invitation = await this.db.$transaction(async (tx) => {
      // Prisma has no row locking (ADR 0004). SKIP LOCKED makes a concurrent request pass over a Seat another one is taking.
      const [seat] = await tx.$queryRaw<{ id: string }[]>`
        SELECT "id" FROM "Seat"
        WHERE "licenceId" = ${dto.licenceId} AND "userId" IS NULL AND "invitationId" IS NULL
        LIMIT 1
        FOR UPDATE SKIP LOCKED`;
      if (!seat) throw new DomainError('NoFreeSeat');
      const created = await tx.invitation.create({
        data: { companyId, email: dto.email, roleKey: dto.role, tokenHash: hashInvitationToken(token) },
      });
      await tx.seat.update({ where: { id: seat.id }, data: { invitationId: created.id } });
      return created;
    });
    return { id: invitation.id, token };
  }

  /** Turns the Seat held by the Invitation into the acting User's Seat. Every failure looks the same, so nothing leaks about accounts. */
  async accept(actingUserId: string, token: string) {
    await this.db.$transaction(async (tx) => {
      const invitation = await tx.invitation.findUnique({
        where: { tokenHash: hashInvitationToken(token) },
        include: { seat: true },
      });
      const user = await tx.user.findUnique({ where: { id: actingUserId } });
      if (!invitation || !user || user.email !== invitation.email || user.companyId !== null) {
        throw new DomainError('InvitationInvalid');
      }
      await tx.seat.update({ where: { id: invitation.seat!.id }, data: { invitationId: null, userId: user.id } });
      await tx.user.update({ where: { id: user.id }, data: { companyId: invitation.companyId, roleKey: invitation.roleKey } });
      await tx.invitation.delete({ where: { id: invitation.id } });
    });
  }

  async pending(companyId: string) {
    const invitations = await this.db.invitation.findMany({ where: { companyId }, include: { seat: true } });
    return invitations.map((i) => ({ id: i.id, email: i.email, role: i.roleKey, licenceId: i.seat?.licenceId }));
  }
}
