import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller.js';
import { InvitationsController } from './invitations.controller.js';
import { LicencesController } from './licences.controller.js';
import { PrismaService } from './prisma.service.js';

@Module({
  controllers: [CompaniesController, InvitationsController, LicencesController],
  providers: [PrismaService],
})
export class AppModule {}
