import { Injectable } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { DomainError } from '../common/domain-error.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class MembersService {
  constructor(private readonly db: PrismaService) {}

  async list(companyId: string) {
    const users = await this.db.user.findMany({ where: { companyId } });
    return users.map((u) => ({ userId: u.id, name: u.name, role: u.roleKey }));
  }

  async remove(companyId: string, userId: string) {
    await this.db.$transaction(async (tx) => {
      await this.assertNotLastAdmin(tx, companyId, userId);
      await tx.user.update({ where: { id: userId }, data: { companyId: null, roleKey: null } });
    });
  }

  async changeRole(companyId: string, userId: string, role: string) {
    await this.db.$transaction(async (tx) => {
      if (role !== 'company-admin') await this.assertNotLastAdmin(tx, companyId, userId);
      await tx.user.update({ where: { id: userId }, data: { roleKey: role } });
    });
  }

  private async assertNotLastAdmin(tx: Prisma.TransactionClient, companyId: string, userId: string) {
    const member = await tx.user.findFirstOrThrow({ where: { id: userId, companyId } });
    if (member.roleKey !== 'company-admin') return;
    const admins = await tx.user.count({ where: { companyId, roleKey: 'company-admin' } });
    if (admins === 1) throw new DomainError('LastCompanyAdmin');
  }
}
