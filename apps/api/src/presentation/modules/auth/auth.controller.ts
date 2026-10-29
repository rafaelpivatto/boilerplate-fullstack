import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import type { Response } from 'express';
import { LoginUseCase } from '../../../application/use-cases/auth/login.use-case';
import { RegisterUseCase } from '../../../application/use-cases/auth/register.use-case';
import { RefreshSessionUseCase } from '../../../application/use-cases/auth/refresh-session.use-case';
import { SESSION_SERVICE, type SessionService } from '../../../domain/ports/token.port';
import { Inject } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard, type AuthenticatedRequest } from '../../common/guards/jwt-auth.guard';

class AuthBody {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly register: RegisterUseCase,
    private readonly login: LoginUseCase,
    private readonly refresh: RefreshSessionUseCase,
    @Inject(SESSION_SERVICE) private readonly sessions: SessionService,
  ) {}

  @Post('register')
  async registerUser(@Body() body: AuthBody, @Res({ passthrough: true }) response: Response) {
    return this.session(response, await this.register.execute(body.email, body.password));
  }

  @Post('login')
  async loginUser(@Body() body: AuthBody, @Res({ passthrough: true }) response: Response) {
    return this.session(response, await this.login.execute(body.email, body.password));
  }

  @Post('refresh')
  async refreshSession(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userId = request.cookies?.refresh_user_id as string | undefined;
    const refreshToken = request.cookies?.refresh_token as string | undefined;
    if (!userId || !refreshToken) throw new UnauthorizedException('Refresh session required');
    return this.session(response, await this.refresh.execute(userId, refreshToken));
  }

  @Post('logout')
  async logout(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userId = request.cookies?.refresh_user_id as string | undefined;
    const refreshToken = request.cookies?.refresh_token as string | undefined;
    if (userId && refreshToken) await this.sessions.revoke(userId, refreshToken);
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    response.clearCookie('refresh_user_id');
    return { ok: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: { id: string; email: string }) {
    return user;
  }

  private session(
    response: Response,
    result: { user: { id: string; email: string }; accessToken: string; refreshToken: string },
  ) {
    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 8,
    });
    response.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    response.cookie('refresh_user_id', result.user.id, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    return { user: { id: result.user.id, email: result.user.email } };
  }
}
