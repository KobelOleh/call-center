import { createHash, randomBytes } from 'node:crypto';
import { Body, ConflictException, Controller, Get, Headers, NotFoundException, Param, Post } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Controller()
export class InvitationsController {
  constructor(private readonly db: PrismaService) {}

  @Post('companies/:id/invitations')
  async invite(@Param('id') id: string, @Body() body: { email: string; role: string; licenceId: string }) {
    const token = randomBytes(32).toString('base64url');
    const invitation = await this.db.$transaction(async (tx) => {
      // Prisma has no row locking (ADR 0004). SKIP LOCKED makes a concurrent request pass over a Seat another one is taking.
      const [seat] = await tx.$queryRaw<{ id: string }[]>`
        SELECT "id" FROM "Seat"
        WHERE "licenceId" = ${body.licenceId} AND "userId" IS NULL AND "invitationId" IS NULL
        LIMIT 1
        FOR UPDATE SKIP LOCKED`;
      if (!seat) throw new ConflictException({ code: 'NoFreeSeat' });
      const created = await tx.invitation.create({
        data: {
          companyId: id,
          email: body.email.trim().toLowerCase(),
          roleKey: body.role,
          tokenHash: createHash('sha256').update(token).digest('hex'),
        },
      });
      await tx.seat.update({ where: { id: seat.id }, data: { invitationId: created.id } });
      return created;
    });
    return { id: invitation.id, token };
  }

  @Post('invitations/accept')
  async accept(@Headers('x-user-id') userId: string, @Body() body: { token: string }) {
    await this.db.$transaction(async (tx) => {
      const invitation = await tx.invitation.findUnique({
        where: { tokenHash: createHash('sha256').update(body.token).digest('hex') },
        include: { seat: true },
      });
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!invitation || !user || user.email !== invitation.email || user.companyId !== null) throw new NotFoundException({ code: 'InvitationInvalid' });
      await tx.seat.update({ where: { id: invitation.seat!.id }, data: { invitationId: null, userId } });
      await tx.user.update({ where: { id: userId }, data: { companyId: invitation.companyId, roleKey: invitation.roleKey } });
      await tx.invitation.delete({ where: { id: invitation.id } });
    });
  }

  @Get('companies/:id/invitations')
  async pending(@Param('id') id: string) {
    const invitations = await this.db.invitation.findMany({ where: { companyId: id }, include: { seat: true } });
    return invitations.map((i) => ({ id: i.id, email: i.email, role: i.roleKey, licenceId: i.seat?.licenceId }));
  }
}
