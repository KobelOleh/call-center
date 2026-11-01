import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Controller()
export class LicencesController {
  constructor(private readonly db: PrismaService) {}

  @Post('companies/:id/licences')
  async createLicence(@Param('id') id: string, @Body() body: { tariffPlan: string; seats: number }) {
    const licence = await this.db.licence.create({
      data: {
        companyId: id,
        tariffPlanKey: body.tariffPlan,
        seats: { create: Array.from({ length: body.seats }, () => ({})) },
      },
    });
    return { id: licence.id };
  }

  @Get('companies/:id/licences')
  async licences(@Param('id') id: string) {
    const licences = await this.db.licence.findMany({ where: { companyId: id }, include: { seats: true } });
    return licences.map((l) => ({
      id: l.id,
      tariffPlan: l.tariffPlanKey,
      seats: l.seats.length,
      freeSeats: l.seats.filter((s) => s.userId === null && s.invitationId === null).length,
    }));
  }
}
