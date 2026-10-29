export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="flex flex-col gap-2">
      <h1 className="font-ledger text-4xl tracking-tight">{title}</h1>
      <p className="text-[var(--muted)]">{description}</p>
    </header>
  );
}
