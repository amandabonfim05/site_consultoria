import { api } from './api';

export interface DiagnosticoResumo {
  nota: number;
  perfil: string;
  categorias: { label: string; value: number; max: number }[];
}

export async function enviarDiagnosticoPorEmail(
  email: string,
  resumo: DiagnosticoResumo,
  imagemBase64: string,
  nomeCliente: string
): Promise<void> {
  await api.post('/diagnostico/email', {
    destinatario: email,
    nomeCliente,
    nota: resumo.nota,
    perfil: resumo.perfil,
    categorias: resumo.categorias,
    imagemBase64,
  });
}