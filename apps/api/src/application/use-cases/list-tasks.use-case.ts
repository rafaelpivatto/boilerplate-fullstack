import { Inject, Injectable } from '@nestjs/common';
import { TASK_REPOSITORY, type TaskRepository } from '../../domain/repositories/task.repository';
import {
  RLS_EXECUTOR,
  type RlsExecutorPort,
} from '../../domain/ports/database-security-context.port';

@Injectable()
export class ListTasksUseCase {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly tasks: TaskRepository,
    @Inject(RLS_EXECUTOR) private readonly rls: RlsExecutorPort,
  ) {}

  execute(userId: string) {
    return this.rls.withContext({ kind: 'user', userId }, () => this.tasks.list());
  }
}
