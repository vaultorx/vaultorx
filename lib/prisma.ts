import { PrismaClient } from "./generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
    datasources: { db: { url: process.env.DATABASE_URL } },
    // 👇 add this
    transactionOptions: {
      maxWait: 5000,
      timeout: 10000,
      isolationLevel: "ReadCommitted",
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
