import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import pg from 'pg';

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
await client.query(readFileSync(join(import.meta.dirname, 'seed.sql'), 'utf8'));
await client.end();
