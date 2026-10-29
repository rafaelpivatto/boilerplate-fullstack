import type { PrismaClient } from '../../../generated/prisma/client';

export type PrismaDbClient = PrismaClient;
export type PrismaTransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
>;
