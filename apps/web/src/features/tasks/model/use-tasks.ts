'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { CreateTaskDto, UpdateTaskDto } from '@project/shared';
import { createTask, deleteTask, listTasks, updateTask } from '../../../entities/task';

export function useTasks() {
  const queryClient = useQueryClient();
  const tasks = useQuery({
    queryKey: ['tasks'],
    queryFn: listTasks,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
  const create = useMutation({
    mutationFn: (input: CreateTaskDto) => createTask(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskDto }) => updateTask(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
  return { tasks, create, update, remove };
}
