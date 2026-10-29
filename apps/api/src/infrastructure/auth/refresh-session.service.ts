import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import {
  REFRESH_TOKEN_REPOSITORY,
  type RefreshTokenRepository,
} from '../../domain/repositories/refresh-token.repository';
import type { SessionService } from '../../domain/ports/token.port';

@Injectable()
export class RefreshSessionService implements SessionService {
  constructor(@Inject(REFRESH_TOKEN_REPOSITORY) private readonly tokens: RefreshTokenRepository) {}

  async issue(userId: string) {
    const raw = randomBytes(32).toString('hex');
    await this.tokens.create(userId, await bcrypt.hash(raw, 12), this.expiration());
    return raw;
  }

  async rotate(userId: string, raw: string) {
    const active = await this.tokens.findActiveByUser(userId);
    const current = await this.findMatching(active, raw);
    if (!current) throw new UnauthorizedException('Invalid refresh session');
    await this.tokens.revoke(current.id);
    return this.issue(userId);
  }

  async revoke(userId: string, raw: string) {
    const active = await this.tokens.findActiveByUser(userId);
    const current = await this.findMatching(active, raw);
    if (current) await this.tokens.revoke(current.id);
  }

  private async findMatching(tokens: readonly { id: string; tokenHash: string }[], raw: string) {
    for (const token of tokens) {
      if (await bcrypt.compare(raw, token.tokenHash)) return token;
    }
    return undefined;
  }

  private expiration() {
    return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  }
}
