import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  SESSION_SERVICE,
  TOKEN_SERVICE,
  type SessionService,
  type TokenService,
} from '../../../domain/ports/token.port';
import { USER_REPOSITORY, type UserRepository } from '../../../domain/repositories/user.repository';

@Injectable()
export class RefreshSessionUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(SESSION_SERVICE) private readonly sessions: SessionService,
    @Inject(TOKEN_SERVICE) private readonly tokens: TokenService,
  ) {}

  async execute(userId: string, refreshToken: string) {
    const user = await this.users.findById(userId);
    if (!user) throw new UnauthorizedException('Invalid refresh session');
    const nextRefreshToken = await this.sessions.rotate(userId, refreshToken);
    return {
      user: { id: user.id, email: user.email },
      accessToken: this.tokens.sign({ sub: user.id, email: user.email }),
      refreshToken: nextRefreshToken,
    };
  }
}
