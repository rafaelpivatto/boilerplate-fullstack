import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PASSWORD_HASHER, type PasswordHasher } from '../../../domain/ports/password-hasher.port';
import {
  SESSION_SERVICE,
  TOKEN_SERVICE,
  type SessionService,
  type TokenService,
} from '../../../domain/ports/token.port';
import { USER_REPOSITORY, type UserRepository } from '../../../domain/repositories/user.repository';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwords: PasswordHasher,
    @Inject(TOKEN_SERVICE) private readonly tokens: TokenService,
    @Inject(SESSION_SERVICE) private readonly sessions: SessionService,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user || !(await this.passwords.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      user: { id: user.id, email: user.email },
      accessToken: this.tokens.sign({ sub: user.id, email: user.email }),
      refreshToken: await this.sessions.issue(user.id),
    };
  }
}
