import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Controller()
export class CompaniesController {
  constructor(private readonly db: PrismaService) {}

  @Post('users')
  async createUser(@Body() body: { name: string }) {
    const user = await this.db.user.create({ data: { name: body.name } });
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

  @Get('companies/:id/members')
  async members(@Param('id') id: string) {
    const users = await this.db.user.findMany({ where: { companyId: id } });
    return users.map((u) => ({ userId: u.id, name: u.name, role: u.roleKey }));
  }
}
