export function EmptyState({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">
      {children}
    </div>
  );
}
