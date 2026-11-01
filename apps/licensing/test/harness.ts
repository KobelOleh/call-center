import { readFileSync } from 'fs';
import { join } from 'path';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import pg from 'pg';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';

export interface Harness {
  http: () => ReturnType<typeof request>;
  stop: () => Promise<void>;
}

export async function startHarness(): Promise<Harness> {
  const container: StartedPostgreSqlContainer = await new PostgreSqlContainer('postgres:17').start();
  const url = container.getConnectionUri();

  const client = new pg.Client({ connectionString: url });
  await client.connect();
  await client.query(readFileSync(join(import.meta.dirname, '../prisma/migrations/0001_init/migration.sql'), 'utf8'));
  await client.query(readFileSync(join(import.meta.dirname, '../prisma/seed.sql'), 'utf8'));
  await client.end();

  process.env.DATABASE_URL = url;
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app: INestApplication = moduleRef.createNestApplication();
  await app.init();

  return {
    http: () => request(app.getHttpServer()),
    stop: async () => {
      await app.close();
      await container.stop();
    },
  };
}
