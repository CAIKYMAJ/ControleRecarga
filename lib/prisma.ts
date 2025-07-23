import { PrismaClient } from "@prisma/client";

// Aqui vai criar uma variável global que vai ser momentania, pq o Next.js fica reiniciando a aplicação várias vezes e precisa ser iniciado apenas uma vez, por isso q ela é momentania
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Aqui é onde vai ser criado ou reutilizado a instância do Prisma
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

// Aqui quando é em ambiente de QA, ele salva a instância criada no global, mas em prod isso não é feito
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
