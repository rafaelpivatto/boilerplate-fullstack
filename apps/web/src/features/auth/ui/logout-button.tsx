'use client';

import { useRouter } from 'next/navigation';
import { logout } from '../../../entities/auth/api/auth.api';

export function LogoutButton() {
  const router = useRouter();

  async function signOut() {
    await logout();
    router.replace('/login');
    router.refresh();
  }

  return (
    <button type="button" onClick={signOut} className="text-sm text-[var(--muted)] hover:underline">
      Sair
    </button>
  );
}
