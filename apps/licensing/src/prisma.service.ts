import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  }

  async onModuleInit() {
    await this.$connect();
    for (const key of ['company-admin', 'manager', 'operator']) {
      await this.role.upsert({ where: { key }, update: {}, create: { key } });
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
