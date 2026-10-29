'use client';

import { FormEvent, useState } from 'react';
import { useTasks } from '../model/use-tasks';

export function CreateTaskForm() {
  const [title, setTitle] = useState('');
  const { create } = useTasks();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    create.mutate({ title: title.trim() }, { onSuccess: () => setTitle('') });
  }
  return (
    <form onSubmit={submit} className="flex gap-3">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Ex.: Criar uma entidade"
        className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--flow)]"
      />
      <button
        type="submit"
        disabled={create.isPending}
        className="rounded-md bg-[var(--primary)] px-4 py-2 font-semibold text-[var(--primary-foreground)] disabled:opacity-50"
      >
        Adicionar
      </button>
    </form>
  );
}
