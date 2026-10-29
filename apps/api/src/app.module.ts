import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RegisterUseCase } from './application/use-cases/auth/register.use-case';
import { LoginUseCase } from './application/use-cases/auth/login.use-case';
import { RefreshSessionUseCase } from './application/use-cases/auth/refresh-session.use-case';
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from './application/use-cases/delete-task.use-case';
import { ListTasksUseCase } from './application/use-cases/list-tasks.use-case';
import { UpdateTaskUseCase } from './application/use-cases/update-task.use-case';
import { PrismaTaskRepository } from './infrastructure/database/prisma-task.repository';
import { PrismaService } from './infrastructure/database/prisma.service';
import { PrismaUserRepository } from './infrastructure/database/prisma-user.repository';
import { PrismaRefreshTokenRepository } from './infrastructure/database/prisma-refresh-token.repository';
import { BcryptPasswordHasher } from './infrastructure/auth/bcrypt-password-hasher';
import { JwtTokenService } from './infrastructure/auth/jwt-token.service';
import { RefreshSessionService } from './infrastructure/auth/refresh-session.service';
import { PASSWORD_HASHER } from './domain/ports/password-hasher.port';
import { TOKEN_SERVICE } from './domain/ports/token.port';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { REFRESH_TOKEN_REPOSITORY } from './domain/repositories/refresh-token.repository';
import { SESSION_SERVICE } from './domain/ports/token.port';
import { RlsDbContextStore } from './infrastructure/database/rls/rls-db-context-store';
import { RlsExecutor } from './infrastructure/database/rls/rls-executor';
import { RLS_EXECUTOR } from './domain/ports/database-security-context.port';
import { AuthController } from './presentation/modules/auth/auth.controller';
import { TASK_REPOSITORY } from './domain/repositories/task.repository';
import { HealthController } from './presentation/modules/health/health.controller';
import { TasksController } from './presentation/modules/tasks/tasks.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'local-development-secret',
      signOptions: { expiresIn: '8h' as never },
    }),
  ],
  controllers: [AuthController, HealthController, TasksController],
  providers: [
    CreateTaskUseCase,
    DeleteTaskUseCase,
    ListTasksUseCase,
    UpdateTaskUseCase,
    RegisterUseCase,
    LoginUseCase,
    RefreshSessionUseCase,
    PrismaService,
    PrismaTaskRepository,
    PrismaUserRepository,
    PrismaRefreshTokenRepository,
    BcryptPasswordHasher,
    JwtTokenService,
    RefreshSessionService,
    RlsDbContextStore,
    RlsExecutor,
    { provide: RLS_EXECUTOR, useExisting: RlsExecutor },
    { provide: USER_REPOSITORY, useExisting: PrismaUserRepository },
    { provide: REFRESH_TOKEN_REPOSITORY, useExisting: PrismaRefreshTokenRepository },
    { provide: PASSWORD_HASHER, useExisting: BcryptPasswordHasher },
    { provide: TOKEN_SERVICE, useExisting: JwtTokenService },
    { provide: SESSION_SERVICE, useExisting: RefreshSessionService },
    { provide: TASK_REPOSITORY, useExisting: PrismaTaskRepository },
  ],
})
export class AppModule {}
