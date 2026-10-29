import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? '' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12);
  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'true', true)`;
    await tx.user.upsert({
      where: { id: 'demo-user-1' },
      update: { passwordHash },
      create: { id: 'demo-user-1', email: 'demo@example.com', passwordHash },
    });
    await tx.task.upsert({
      where: { id: 'example-task-1' },
      update: { ownerId: 'demo-user-1' },
      create: {
        id: 'example-task-1',
        title: 'Replace this example with your first domain entity',
        ownerId: 'demo-user-1',
      },
    });
    await tx.task.upsert({
      where: { id: 'example-task-2' },
      update: { ownerId: 'demo-user-1' },
      create: {
        id: 'example-task-2',
        title: 'Add a migration and a repository adapter',
        ownerId: 'demo-user-1',
      },
    });
  });
}

main().finally(() => prisma.$disconnect());
