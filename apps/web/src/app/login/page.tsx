import { LoginForm } from '../../features/auth';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--background)] px-6">
      <div className="text-center">
        <h1 className="font-ledger text-4xl">Entrar</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Demo: demo@example.com / password123</p>
      </div>
      <LoginForm />
    </main>
  );
}
