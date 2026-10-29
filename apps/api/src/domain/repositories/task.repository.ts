import type { Task } from '../entities/task.entity';
import type { TaskStatus } from '@project/shared';

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');

export interface TaskRepository {
  list(): Promise<readonly Task[]>;
  create(title: string, ownerId: string): Promise<Task>;
  update(id: string, input: { title?: string; status?: TaskStatus }): Promise<Task>;
  delete(id: string): Promise<void>;
}
