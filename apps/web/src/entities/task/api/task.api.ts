import type { CreateTaskDto, TaskDto, UpdateTaskDto } from '@project/shared';
import { api } from '../../../shared/config/api';

export async function listTasks(): Promise<TaskDto[]> {
  const response = await api.get<TaskDto[]>('/tasks');
  return response.data;
}

export async function createTask(input: CreateTaskDto): Promise<TaskDto> {
  const response = await api.post<TaskDto>('/tasks', input);
  return response.data;
}

export async function updateTask(id: string, input: UpdateTaskDto): Promise<TaskDto> {
  const response = await api.patch<TaskDto>(`/tasks/${id}`, input);
  return response.data;
}

export async function deleteTask(id: string): Promise<{ id: string }> {
  const response = await api.delete<{ id: string }>(`/tasks/${id}`);
  return response.data;
}
