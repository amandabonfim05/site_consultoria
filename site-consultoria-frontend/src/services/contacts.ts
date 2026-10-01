import { api } from './api';
import type { Contato, ContatoPayload } from '../types/contact';

export async function listContatos(): Promise<Contato[]> {
  const { data } = await api.get<Contato[]>('/contatos');
  return data;
}

export async function getContato(id: string): Promise<Contato> {
  const { data } = await api.get<Contato>(`/contatos/${id}`);
  return data;
}

export async function createContato(payload: ContatoPayload): Promise<Contato> {
  const { data } = await api.post<Contato>('/contatos', payload);
  return data;
}

export async function updateContato(id: string, payload: ContatoPayload): Promise<Contato> {
  const { data } = await api.put<Contato>(`/contatos/${id}`, payload);
  return data;
}

export async function deleteContato(id: string): Promise<void> {
  await api.delete(`/contatos/${id}`);
}
