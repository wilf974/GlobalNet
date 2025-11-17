import { PrismaClient } from '@prisma/client';

/**
 * Singleton instance of PrismaClient
 *
 * In development, we create a global instance to avoid creating multiple clients.
 * In production, we always use a new client instance.
 *
 * This prevents connection pool issues during hot reload in development.
 */

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
