import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Prisma 7 is "no Rust engine": the client talks to Postgres through a driver
// adapter. The pooled Neon connection string lives in DATABASE_URL.
const connectionString = process.env.DATABASE_URL;

// Reuse a single PrismaClient across hot reloads in dev to avoid exhausting
// the database connection pool. In production a fresh instance is fine.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
