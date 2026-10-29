import { Inject, Injectable } from '@nestjs/common';
import { TASK_REPOSITORY, type TaskRepository } from '../../domain/repositories/task.repository';
import {
  RLS_EXECUTOR,
  type RlsExecutorPort,
} from '../../domain/ports/database-security-context.port';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly tasks: TaskRepository,
    @Inject(RLS_EXECUTOR) private readonly rls: RlsExecutorPort,
  ) {}

  execute(title: string, ownerId: string) {
    return this.rls.withContext({ kind: 'user', userId: ownerId }, () =>
      this.tasks.create(title, ownerId),
    );
  }
}
