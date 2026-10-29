export const REFRESH_TOKEN_REPOSITORY = Symbol('REFRESH_TOKEN_REPOSITORY');

export interface RefreshTokenRepository {
  create(userId: string, tokenHash: string, expiresAt: Date): Promise<void>;
  findActiveByUser(userId: string): Promise<readonly { id: string; tokenHash: string }[]>;
  revoke(id: string): Promise<void>;
}
