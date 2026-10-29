import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '../../../shared/config/api';
import { createTask, deleteTask, listTasks, updateTask } from './task.api';

vi.mock('../../../shared/config/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('task API', () => {
  beforeEach(() => vi.clearAllMocks());

  it('maps CRUD operations to the HTTP contract', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] });
    vi.mocked(api.post).mockResolvedValue({ data: { id: '1' } });
    vi.mocked(api.patch).mockResolvedValue({ data: { id: '1', status: 'DONE' } });
    vi.mocked(api.delete).mockResolvedValue({ data: { id: '1' } });

    await listTasks();
    await createTask({ title: 'Draft docs' });
    await updateTask('1', { status: 'DONE' });
    await deleteTask('1');

    expect(api.get).toHaveBeenCalledWith('/tasks');
    expect(api.post).toHaveBeenCalledWith('/tasks', { title: 'Draft docs' });
    expect(api.patch).toHaveBeenCalledWith('/tasks/1', { status: 'DONE' });
    expect(api.delete).toHaveBeenCalledWith('/tasks/1');
  });
});
