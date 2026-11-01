import { Body, ConflictException, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import type { Prisma } from './generated/prisma/client.js';
import { PrismaService } from './prisma.service.js';

@Controller()
export class CompaniesController {
  constructor(private readonly db: PrismaService) {}

  @Post('users')
  async createUser(@Body() body: { name: string; email: string }) {
    const user = await this.db.user.create({ data: { name: body.name, email: body.email.trim().toLowerCase() } });
    return { id: user.id };
  }

  @Post('companies')
  async createCompany(@Headers('x-user-id') userId: string, @Body() body: { name: string }) {
    return this.db.$transaction(async (tx) => {
      const company = await tx.company.create({ data: { name: body.name } });
      await tx.user.update({ where: { id: userId }, data: { companyId: company.id, roleKey: 'company-admin' } });
      return { id: company.id, name: company.name };
    });
  }

  @Delete('companies/:id/members/:userId')
  async removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    await this.db.$transaction(async (tx) => {
      await this.assertNotLastAdmin(tx, id, userId);
      await tx.user.update({ where: { id: userId }, data: { companyId: null, roleKey: null } });
    });
  }

  @Patch('companies/:id/members/:userId')
  async changeRole(@Param('id') id: string, @Param('userId') userId: string, @Body() body: { role: string }) {
    await this.db.$transaction(async (tx) => {
      if (body.role !== 'company-admin') await this.assertNotLastAdmin(tx, id, userId);
      await tx.user.update({ where: { id: userId }, data: { roleKey: body.role } });
    });
  }

  private async assertNotLastAdmin(tx: Prisma.TransactionClient, companyId: string, userId: string) {
    const member = await tx.user.findFirstOrThrow({ where: { id: userId, companyId } });
    if (member.roleKey !== 'company-admin') return;
    const admins = await tx.user.count({ where: { companyId, roleKey: 'company-admin' } });
    if (admins === 1) throw new ConflictException({ code: 'LastCompanyAdmin' });
  }

  @Get('companies/:id/members')
  async members(@Param('id') id: string) {
    const users = await this.db.user.findMany({ where: { companyId: id } });
    return users.map((u) => ({ userId: u.id, name: u.name, role: u.roleKey }));
  }
}
