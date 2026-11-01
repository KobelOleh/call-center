import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateLicenceDto } from './create-licence.dto.js';

@Injectable()
export class LicencesService {
  constructor(private readonly db: PrismaService) {}

  async create(companyId: string, dto: CreateLicenceDto) {
    const licence = await this.db.licence.create({
      data: {
        companyId,
        tariffPlanKey: dto.tariffPlan,
        seats: { create: Array.from({ length: dto.seats }, () => ({})) },
      },
    });
    return { id: licence.id };
  }

  async list(companyId: string) {
    const licences = await this.db.licence.findMany({ where: { companyId }, include: { seats: true } });
    return licences.map((l) => ({
      id: l.id,
      tariffPlan: l.tariffPlanKey,
      seats: l.seats.length,
      freeSeats: l.seats.filter((s) => s.userId === null && s.invitationId === null).length,
    }));
  }
}
