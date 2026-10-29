import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { TaskStatus } from '@project/shared';
import { Task } from '../../domain/entities/task.entity';
import type { TaskRepository } from '../../domain/repositories/task.repository';

@Injectable()
export class InMemoryTaskRepository implements TaskRepository {
  private readonly items: Task[] = [];

  list() {
    return Promise.resolve(this.items);
  }

  create(title: string, _ownerId: string) {
    const task = Task.create({ id: randomUUID(), title });
    this.items.unshift(task);
    return Promise.resolve(task);
  }

  update(id: string, input: { title?: string; status?: TaskStatus }) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Task not found');
    const updated = this.items[index]?.update(input);
    if (!updated) throw new Error('Task not found');
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
