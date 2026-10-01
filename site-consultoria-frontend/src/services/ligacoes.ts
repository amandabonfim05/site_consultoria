import { api } from './api';

export async function confirmarLigacao(): Promise<void> {
  await api.post('/ligacoes');
}
