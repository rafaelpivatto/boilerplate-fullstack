import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { DatabaseSecurityContext } from '../../../domain/ports/database-security-context.port';
import type { RlsExecutorPort } from '../../../domain/ports/database-security-context.port';
import type { PrismaTransactionClient } from './prisma-db-client';
import { RlsDbContextStore } from './rls-db-context-store';

@Injectable()
export class RlsExecutor implements RlsExecutorPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly store: RlsDbContextStore,
  ) {}

  withContext<T>(context: DatabaseSecurityContext, run: () => Promise<T>) {
    return this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.user_id', ${context.kind === 'user' ? context.userId : ''}, true)`;
      await tx.$executeRaw`SELECT set_config('app.bypass_rls', ${context.kind === 'system' && context.bypassRls ? 'true' : 'false'}, true)`;
      return this.store.run(tx, run);
    });
  }
}
