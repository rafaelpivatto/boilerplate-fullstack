import type { TaskStatus } from '@project/shared';

export class Task {
  private constructor(
    readonly id: string,
    readonly title: string,
    readonly status: TaskStatus,
    readonly createdAt: Date,
  ) {}

  static create(input: { id: string; title: string; status?: TaskStatus; createdAt?: Date }): Task {
    const title = input.title.trim();
    if (!title) throw new Error('Task title cannot be empty');
    return new Task(input.id, title, input.status ?? 'TODO', input.createdAt ?? new Date());
  }

  update(input: { title?: string; status?: TaskStatus }): Task {
    return Task.create({
      id: this.id,
      title: input.title ?? this.title,
      status: input.status ?? this.status,
      createdAt: this.createdAt,
    });
  }
}
