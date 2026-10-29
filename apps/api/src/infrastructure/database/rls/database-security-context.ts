export type UserDatabaseSecurityContext = {
  kind: 'user';
  userId: string;
};

export type SystemDatabaseSecurityContext = {
  kind: 'system';
  reason: 'seed' | 'migration-backfill';
  bypassRls: boolean;
};

export type DatabaseSecurityContext = UserDatabaseSecurityContext | SystemDatabaseSecurityContext;
