export type DatabaseSecurityContext =
  | { kind: 'user'; userId: string }
  | { kind: 'system'; reason: 'seed' | 'migration-backfill'; bypassRls: boolean };

export const RLS_EXECUTOR = Symbol('RLS_EXECUTOR');

export interface RlsExecutorPort {
  withContext<T>(context: DatabaseSecurityContext, run: () => Promise<T>): Promise<T>;
}
