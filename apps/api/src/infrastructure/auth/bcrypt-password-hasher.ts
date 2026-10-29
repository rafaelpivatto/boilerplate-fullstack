import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { PasswordHasher } from '../../domain/ports/password-hasher.port';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  hash(password: string) {
    return bcrypt.hash(password, 12);
  }

  compare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
