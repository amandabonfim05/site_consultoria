import { z } from 'zod';

export const enviarDiagnosticoEmailSchema = z.object({
  destinatario: z.string().email('E-mail inválido'),
  nomeCliente: z.string().optional(),
  nota: z.number().min(0).max(100),
  perfil: z.string().min(1),
  categorias: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
      max: z.number().positive().default(4),
    })
  ),
  imagemBase64: z.string().min(1, 'Imagem do gráfico é obrigatória'),
});

export type EnviarDiagnosticoEmailInput = z.infer<typeof enviarDiagnosticoEmailSchema>;