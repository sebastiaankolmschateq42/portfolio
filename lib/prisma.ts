import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: { client?: PrismaClient; generatedClass?: typeof PrismaClient };
};

function createClient() {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
}

const cached = globalForPrisma.prisma;
const cacheIsCurrent = cached?.client && cached.generatedClass === PrismaClient;

if (cached?.client && !cacheIsCurrent) {
  cached.client.$disconnect().catch(() => {});
}

export const prisma = cacheIsCurrent ? cached.client! : createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = { client: prisma, generatedClass: PrismaClient };
}
