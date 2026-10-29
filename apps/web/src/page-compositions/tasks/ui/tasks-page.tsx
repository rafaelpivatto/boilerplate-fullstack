import { CreateTaskForm } from '../../../features/tasks';
import { LogoutButton } from '../../../features/auth';
import { TaskList } from '../../../widgets/tasks';
import { Card, PageHeader } from '../../../shared/ui';

export function TasksPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-6 py-16">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Tasks"
          description="Vertical slice de exemplo para iniciar um novo produto."
        />
        <LogoutButton />
      </div>
      <Card>
        <div className="mb-5">
          <CreateTaskForm />
        </div>
        <TaskList />
      </Card>
      <p className="text-sm text-[var(--muted)]">
        Troque esta composição pelo dashboard ou fluxo principal do seu domínio.
      </p>
    </main>
  );
}
