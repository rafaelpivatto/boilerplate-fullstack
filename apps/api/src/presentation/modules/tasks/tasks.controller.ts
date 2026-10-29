import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TASK_STATUSES } from '@project/shared';
import { CreateTaskUseCase } from '../../../application/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from '../../../application/use-cases/delete-task.use-case';
import { ListTasksUseCase } from '../../../application/use-cases/list-tasks.use-case';
import { UpdateTaskUseCase } from '../../../application/use-cases/update-task.use-case';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

class CreateTaskBody {
  @IsString()
  @IsNotEmpty()
  title!: string;
}

class UpdateTaskBody {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsIn(TASK_STATUSES)
  status?: (typeof TASK_STATUSES)[number];
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(
    private readonly listTasks: ListTasksUseCase,
    private readonly createTask: CreateTaskUseCase,
    private readonly updateTask: UpdateTaskUseCase,
    private readonly deleteTask: DeleteTaskUseCase,
  ) {}

  @Get()
  list(@CurrentUser() user: { id: string }) {
    return this.listTasks.execute(user.id);
  }

  @Post()
  create(@Body() body: CreateTaskBody, @CurrentUser() user: { id: string }) {
    return this.createTask.execute(body.title, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateTaskBody,
    @CurrentUser() user: { id: string },
  ) {
    return this.updateTask.execute(id, user.id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.deleteTask.execute(id, user.id);
  }
}
