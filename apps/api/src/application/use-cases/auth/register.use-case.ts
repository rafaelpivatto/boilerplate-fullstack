import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PASSWORD_HASHER, type PasswordHasher } from '../../../domain/ports/password-hasher.port';
import {
  SESSION_SERVICE,
  TOKEN_SERVICE,
  type SessionService,
  type TokenService,
} from '../../../domain/ports/token.port';
import { USER_REPOSITORY, type UserRepository } from '../../../domain/repositories/user.repository';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwords: PasswordHasher,
    @Inject(TOKEN_SERVICE) private readonly tokens: TokenService,
    @Inject(SESSION_SERVICE) private readonly sessions: SessionService,
  ) {}

  async execute(email: string, password: string) {
    if (password.length < 8)
      throw new ConflictException('Password must have at least 8 characters');
    if (await this.users.findByEmail(email))
      throw new ConflictException('Email already registered');
    const user = await this.users.create(email, await this.passwords.hash(password));
    return {
      user: { id: user.id, email: user.email },
      accessToken: this.tokens.sign({ sub: user.id, email: user.email }),
      refreshToken: await this.sessions.issue(user.id),
    };
  }
}
