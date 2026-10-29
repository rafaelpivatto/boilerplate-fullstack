import { Injectable } from '@nestjs/common';
import type { TaskStatus } from '@project/shared';
import { Task } from '../../domain/entities/task.entity';
import type { TaskRepository } from '../../domain/repositories/task.repository';
import { PrismaService } from './prisma.service';
import { RlsDbContextStore } from './rls/rls-db-context-store';

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly context: RlsDbContextStore,
  ) {}

  private get client() {
    return this.context.getClient(this.prisma);
  }

  async list() {
    const rows = await this.client.task.findMany({ orderBy: { createdAt: 'desc' } });
    return rows.map((row) =>
      Task.create({
        id: row.id,
        title: row.title,
        status: row.status as TaskStatus,
        createdAt: row.createdAt,
      }),
    );
  }

  async create(title: string, ownerId: string) {
    const row = await this.client.task.create({ data: { title, ownerId } });
    return Task.create({
      id: row.id,
      title: row.title,
      status: row.status as TaskStatus,
      createdAt: row.createdAt,
    });
  }

  async update(id: string, input: { title?: string; status?: TaskStatus }) {
    const data: { title?: string; status?: string } = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.status !== undefined) data.status = input.status;
    const row = await this.client.task.update({
      where: { id },
      data,
    });
    return Task.create({
      id: row.id,
      title: row.title,
      status: row.status as TaskStatus,
      createdAt: row.createdAt,
    });
  }

  async delete(id: string) {
    await this.client.task.delete({ where: { id } });
  }
}
