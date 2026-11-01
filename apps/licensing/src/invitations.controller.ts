import { createHash, randomBytes } from 'node:crypto';
import { Body, ConflictException, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Get('companies/:id/invitations')
  async pending(@Param('id') id: string) {
    const invitations = await this.db.invitation.findMany({ where: { companyId: id }, include: { seat: true } });
    return invitations.map((i) => ({ id: i.id, email: i.email, role: i.roleKey, licenceId: i.seat?.licenceId }));
  }
}
