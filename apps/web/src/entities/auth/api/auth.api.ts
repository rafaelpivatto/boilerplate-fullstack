import type { LoginDto, UserDto } from '@project/shared';
import { api } from '../../../shared/config/api';

export async function login(input: LoginDto): Promise<UserDto> {
  const response = await api.post<{ user: UserDto }>('/auth/login', input);
  return response.data.user;
}

export async function logout() {
  await api.post('/auth/logout');
}
