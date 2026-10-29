import { AsyncLocalStorage } from 'node:async_hooks';
import { Injectable } from '@nestjs/common';
import type { PrismaDbClient, PrismaTransactionClient } from './prisma-db-client';

@Injectable()
export class RlsDbContextStore {
  private readonly storage = new AsyncLocalStorage<PrismaTransactionClient>();

  run<T>(client: PrismaTransactionClient, callback: () => Promise<T>) {
    return this.storage.run(client, callback);
  }

  getClient(defaultClient: PrismaDbClient): PrismaDbClient | PrismaTransactionClient {
    return this.storage.getStore() ?? defaultClient;
  }
}
