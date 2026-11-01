import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { LicencesController } from './licences.controller.js';
import { LicencesService } from './licences.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [LicencesController],
  providers: [LicencesService],
})
export class LicencesModule {}
