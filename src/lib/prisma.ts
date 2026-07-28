import { PrismaClient } from "@prisma/client";

// Singleton de Prisma Client para evitar múltiples instancias
// durante hot-reload en desarrollo
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
