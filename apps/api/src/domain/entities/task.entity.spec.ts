import { describe, expect, it } from 'vitest';
import { Task } from './task.entity';

describe('Task', () => {
  it('rejects empty titles and trims valid titles', () => {
    expect(() => Task.create({ id: '1', title: '   ' })).toThrow();
    expect(Task.create({ id: '1', title: '  Draft docs  ' }).title).toBe('Draft docs');
  });

  it('updates only the fields provided', () => {
    const task = Task.create({ id: '1', title: 'Draft docs' });
    const updated = task.update({ status: 'DONE' });

    expect(updated.title).toBe('Draft docs');
    expect(updated.status).toBe('DONE');
    expect(updated.id).toBe(task.id);
  });
});
