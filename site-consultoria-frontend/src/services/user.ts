import { api } from './api';
import type { UserProfile } from '../types/user';

export async function getMe(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>('/users/me');
  return data;
}

export async function updateMe(payload: UserProfile): Promise<UserProfile> {
  const { data } = await api.put<UserProfile>('/users/me', payload);
  return data;
}
