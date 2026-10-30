import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller.js';
import { PrismaService } from './prisma.service.js';

@Module({
  controllers: [CompaniesController],
  providers: [PrismaService],
})
export class AppModule {}
