import { prisma } from '@/lib/prisma';
import 'dotenv/config';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import type { Environment } from 'vitest/environments';

function generateDatabaseUrl(url: string, schema: string) {
  if (!url) {
    throw new Error('Please provide a DATABASE_URL environment variable.');
  }

  const newUrl = new URL(url);

  newUrl.searchParams.set('schema', schema);

  return url.toString();
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const url = process.env.DATABASE_URL;
    const urlShadow = process.env.SHADOW_DATABASE_URL;

    if (!url || !urlShadow) {
      throw new Error('Please provide a DATABASE_URL environment variable.');
    }

    const schema = randomUUID();
    const databaseUrl = generateDatabaseUrl(url, schema);
    const databaseShadowUrl = generateDatabaseUrl(urlShadow, schema);

    process.env.DATABASE_URL = databaseUrl;
    process.env.DATABASE__SHADOW_URL = databaseShadowUrl;

    // Aumentar timeout para migrações
    try {
      execSync('npx prisma migrate deploy', {
        timeout: 60000, // 60 segundos
        env: {
          ...process.env,
          PRISMA_MIGRATE_LOCK_TIMEOUT: '30000',
        },
      });
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        );

        await prisma.$disconnect();
      },
    };
  },
};
