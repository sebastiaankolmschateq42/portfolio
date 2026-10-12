import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

// In development Next.js reloads modules on every change; reusing the client
// prevents a new connection pool per reload.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
