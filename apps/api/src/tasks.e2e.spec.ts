import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './presentation/common/filters/http-exception.filter';

describe('authentication and task RLS', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(() => app.close());

  it('isolates task CRUD between two authenticated users and rotates refresh sessions', async () => {
    const userA = request.agent(app.getHttpServer());
    const userB = request.agent(app.getHttpServer());
    const suffix = Date.now();

    await userA
      .post('/api/v1/auth/register')
      .send({ email: `a-${suffix}@example.com`, password: 'password123' })
      .expect(201);
    await userB
      .post('/api/v1/auth/register')
      .send({ email: `b-${suffix}@example.com`, password: 'password123' })
      .expect(201);

    const created = await userA.post('/api/v1/tasks').send({ title: 'Private task' }).expect(201);
    const taskId = created.body.id as string;

    const listB = await userB.get('/api/v1/tasks').expect(200);
    expect(listB.body).toEqual([]);
    await userB.patch(`/api/v1/tasks/${taskId}`).send({ title: 'Should be blocked' }).expect(404);
    await userB.delete(`/api/v1/tasks/${taskId}`).expect(404);

    const refreshed = await userA.post('/api/v1/auth/refresh').expect(201);
    expect(refreshed.body.user).toHaveProperty('email', `a-${suffix}@example.com`);
    await userA.get('/api/v1/tasks').expect(200);
  });
});
