import { config } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

// Next.js keeps secrets in .env.local; load that so Prisma CLI sees the same vars.
config({ path: '.env.local' });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Migrations run over the direct (non-pooled) connection.
    url: env('DIRECT_URL'),
  },
});
