import { describe, expect, it } from 'vitest';
import { Task } from '../../domain/entities/task.entity';
import type {
  DatabaseSecurityContext,
  RlsExecutorPort,
} from '../../domain/ports/database-security-context.port';
import type { TaskRepository } from '../../domain/repositories/task.repository';
import { CreateTaskUseCase } from './create-task.use-case';
import { DeleteTaskUseCase } from './delete-task.use-case';
import { UpdateTaskUseCase } from './update-task.use-case';

class FakeTaskRepository implements TaskRepository {
  private readonly items: Task[] = [];

  list() {
    return Promise.resolve(this.items);
  }

  create(title: string, _ownerId: string) {
    const task = Task.create({ id: String(this.items.length + 1), title });
    this.items.push(task);
    return Promise.resolve(task);
  }

  update(id: string, input: { title?: string; status?: 'TODO' | 'IN_PROGRESS' | 'DONE' }) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Task not found');
    const task = this.items[index];
    if (!task) throw new Error('Task not found');
    const updated = task.update(input);
    this.items[index] = updated;
    return Promise.resolve(updated);
  }

  delete(id: string) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Task not found');
    this.items.splice(index, 1);
    return Promise.resolve();
  }
}

class FakeRlsExecutor implements RlsExecutorPort {
  withContext<T>(_context: DatabaseSecurityContext, run: () => Promise<T>) {
    return run();
  }
}

describe('task use cases', () => {
  it('creates, updates and deletes through the repository port', async () => {
    const repository = new FakeTaskRepository();
    const rls = new FakeRlsExecutor();
    const create = new CreateTaskUseCase(repository, rls);
    const update = new UpdateTaskUseCase(repository, rls);
    const remove = new DeleteTaskUseCase(repository, rls);

    const task = await create.execute('Draft docs', 'user-1');
    const updated = await update.execute(task.id, 'user-1', {
      title: 'Publish docs',
      status: 'DONE',
    });
    const result = await remove.execute(task.id, 'user-1');

    expect(updated.title).toBe('Publish docs');
    expect(updated.status).toBe('DONE');
    expect(result).toEqual({ id: task.id });
    await expect(repository.list()).resolves.toEqual([]);
  });
});
