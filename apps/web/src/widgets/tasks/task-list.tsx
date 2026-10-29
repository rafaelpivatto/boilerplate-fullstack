'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import type { TaskDto, UpdateTaskDto } from '@project/shared';
import { useTasks } from '../../features/tasks';
import { EmptyState } from '../../shared/ui';

function TaskRow({
  task,
  onUpdate,
  onDelete,
}: {
  task: TaskDto;
  onUpdate: (input: UpdateTaskDto) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const nextStatus = task.status === 'DONE' ? 'TODO' : 'DONE';

  function saveTitle() {
    if (!title.trim()) return;
    onUpdate({ title: title.trim() });
    setEditing(false);
  }

  return (
    <li className="flex items-center gap-3 py-3">
      {editing ? (
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && saveTitle()}
          className="min-w-0 flex-1 rounded border border-[var(--border)] bg-[var(--surface-raised)] px-2 py-1"
          autoFocus
        />
      ) : (
        <button
          type="button"
          onClick={() => onUpdate({ status: nextStatus })}
          className="flex-1 text-left hover:text-[var(--primary)]"
        >
          <span className={task.status === 'DONE' ? 'text-[var(--muted)] line-through' : ''}>
            {task.title}
          </span>
        </button>
      )}
      <span className="text-xs uppercase tracking-wide text-[var(--muted)]">{task.status}</span>
      {editing ? (
        <button
          type="button"
          onClick={saveTitle}
          className="text-sm text-[var(--primary)] hover:underline"
        >
          Salvar
        </button>
      ) : (
        <button type="button" onClick={() => setEditing(true)} className="text-sm hover:underline">
          Editar
        </button>
      )}
      <button type="button" onClick={onDelete} className="text-sm text-red-700 hover:underline">
        Excluir
      </button>
    </li>
  );
}

export function TaskList() {
  const router = useRouter();
  const { tasks, update, remove } = useTasks();
  useEffect(() => {
    if (tasks.isError && axios.isAxiosError(tasks.error) && tasks.error.response?.status === 401) {
      router.replace('/login');
    }
  }, [router, tasks.error, tasks.isError]);
  if (tasks.isLoading) return <p className="text-sm text-[var(--muted)]">Carregando…</p>;
  if (tasks.isError)
    return (
      <p className="text-sm text-red-700">
        Não foi possível carregar as tarefas. Verifique se a API está rodando.
      </p>
    );
  if (!tasks.data?.length)
    return (
      <EmptyState>Nenhuma tarefa ainda. Use o formulário acima para criar a primeira.</EmptyState>
    );
  return (
    <ul className="divide-y divide-[var(--border)]">
      {tasks.data.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onUpdate={(input) => update.mutate({ id: task.id, input })}
          onDelete={() => remove.mutate(task.id)}
        />
      ))}
    </ul>
  );
}
