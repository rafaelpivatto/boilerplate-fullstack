import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { TokenPayload, TokenService } from '../../domain/ports/token.port';

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(private readonly jwt: JwtService) {}

  sign(payload: TokenPayload) {
    return this.jwt.sign(payload);
  }

  verify(token: string) {
    return this.jwt.verify<TokenPayload>(token);
  }
}
