import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

// A global singleton is created once per server process
export const client = globalThis.prisma || new PrismaClient();

// Prevent multiple instances of Prisma Client in development
if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = client;
}
