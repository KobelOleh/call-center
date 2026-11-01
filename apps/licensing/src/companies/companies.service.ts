import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCompanyDto } from './company.dto.js';

@Injectable()
export class CompaniesService {
  constructor(private readonly db: PrismaService) {}

  /** Creates the Company and makes the acting User its first Company Admin. */
  create(actingUserId: string, dto: CreateCompanyDto) {
    return this.db.$transaction(async (tx) => {
      const company = await tx.company.create({ data: { name: dto.name } });
      await tx.user.update({ where: { id: actingUserId }, data: { companyId: company.id, roleKey: 'company-admin' } });
      return { id: company.id, name: company.name };
    });
  }
}
