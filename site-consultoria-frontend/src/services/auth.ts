import { api } from './api';
import type { LoginCredentials, LoginResponse } from '../types/auth';
import type { SignUpPayload, SignUpResponse } from '../types/signup';

const TOKEN_KEY = '@site-consultoria:token';

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', credentials);
  localStorage.setItem(TOKEN_KEY, data.token);
  return data;
}

export async function signUp(payload: SignUpPayload): Promise<SignUpResponse> {
  const { data } = await api.post<SignUpResponse>('/auth/signup', payload);
  localStorage.setItem(TOKEN_KEY, data.token);
  return data;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}
