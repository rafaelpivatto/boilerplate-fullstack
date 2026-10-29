import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    const row = await this.prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    return row ? User.create(row) : null;
  }

  async findById(id: string) {
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row ? User.create(row) : null;
  }

  async create(email: string, passwordHash: string) {
    const row = await this.prisma.user.create({ data: { email, passwordHash } });
    return User.create(row);
  }
}
