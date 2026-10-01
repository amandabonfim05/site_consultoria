import { api } from './api';

export async function updateMeta(metaMensal: number): Promise<{ metaMensal: number }> {
  const { data } = await api.put<{ metaMensal: number }>('/users/me/meta', { metaMensal });
  return data;
}
