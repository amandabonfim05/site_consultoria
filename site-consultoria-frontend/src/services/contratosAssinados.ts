import { api } from './api';
import type { Contrato, NovoContratoPayload } from '../types/contrato';

export async function listContratos(): Promise<Contrato[]> {
  const { data } = await api.get<Contrato[]>('/contratos');
  return data;
}

export async function getContratoDetalhe(id: string): Promise<Contrato> {
  const { data } = await api.get<Contrato>(`/contratos/${id}`);
  return data;
}

export async function createContratoAssinado(payload: NovoContratoPayload): Promise<Contrato> {
  const { data } = await api.post<Contrato>('/contratos', payload);
  return data;
}

export async function cancelarContratoAssinado(id: string): Promise<void> {
  await api.delete(`/contratos/${id}`);
}
