import { Inject, Injectable } from '@nestjs/common';
import { TASK_REPOSITORY, type TaskRepository } from '../../domain/repositories/task.repository';
import {
  RLS_EXECUTOR,
  type RlsExecutorPort,
} from '../../domain/ports/database-security-context.port';

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly tasks: TaskRepository,
    @Inject(RLS_EXECUTOR) private readonly rls: RlsExecutorPort,
  ) {}

  execute(
    id: string,
    userId: string,
    input: { title?: string; status?: 'TODO' | 'IN_PROGRESS' | 'DONE' },
  ) {
    return this.rls.withContext({ kind: 'user', userId }, () => this.tasks.update(id, input));
  }
}
