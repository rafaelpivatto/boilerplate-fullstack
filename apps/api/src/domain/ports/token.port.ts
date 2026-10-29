export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');

export interface TokenPayload {
  sub: string;
  email: string;
}

export interface TokenService {
  sign(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}

export const SESSION_SERVICE = Symbol('SESSION_SERVICE');

export interface SessionService {
  issue(userId: string): Promise<string>;
  rotate(userId: string, token: string): Promise<string>;
  revoke(userId: string, token: string): Promise<void>;
}
