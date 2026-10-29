import { describe, expect, it } from 'vitest';
import { User } from '../../../domain/entities/user.entity';
import type { PasswordHasher } from '../../../domain/ports/password-hasher.port';
import type { SessionService, TokenService } from '../../../domain/ports/token.port';
import type { UserRepository } from '../../../domain/repositories/user.repository';
import { LoginUseCase } from './login.use-case';
import { RegisterUseCase } from './register.use-case';

class FakeUsers implements UserRepository {
  private readonly users: User[] = [];

  findByEmail(email: string) {
    return Promise.resolve(this.users.find((user) => user.email === email.toLowerCase()) ?? null);
  }

  findById(id: string) {
    return Promise.resolve(this.users.find((user) => user.id === id) ?? null);
  }

  create(email: string, passwordHash: string) {
    const user = User.create({ id: String(this.users.length + 1), email, passwordHash });
    this.users.push(user);
    return Promise.resolve(user);
  }
}

class FakePasswords implements PasswordHasher {
  hash(password: string) {
    return Promise.resolve(`hash:${password}`);
  }
  compare(password: string, hash: string) {
    return Promise.resolve(hash === `hash:${password}`);
  }
}

class FakeTokens implements TokenService {
  sign(payload: { sub: string; email: string }) {
    return `${payload.sub}:${payload.email}`;
  }
  verify(token: string) {
    return { sub: token.split(':')[0] ?? '', email: token.split(':')[1] ?? '' };
  }
}

class FakeSessions implements SessionService {
  issue(userId: string) {
    return Promise.resolve(`refresh:${userId}`);
  }
  rotate(userId: string) {
    return Promise.resolve(`refresh:${userId}:next`);
  }
  revoke() {
    return Promise.resolve();
  }
}

describe('auth use cases', () => {
  it('registers and authenticates a user without exposing the password hash', async () => {
    const users = new FakeUsers();
    const passwords = new FakePasswords();
    const tokens = new FakeTokens();
    const sessions = new FakeSessions();
    const register = new RegisterUseCase(users, passwords, tokens, sessions);
    const login = new LoginUseCase(users, passwords, tokens, sessions);

    const registered = await register.execute('DEMO@example.com', 'password123');
    const authenticated = await login.execute('demo@example.com', 'password123');

    expect(registered.user.email).toBe('demo@example.com');
    expect(registered.user).not.toHaveProperty('passwordHash');
    expect(authenticated.accessToken).toBe(`${registered.user.id}:demo@example.com`);
  });
});
