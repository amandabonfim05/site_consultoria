import { z } from 'zod';

export const criarContratoSchema = z.object({
  contatoId: z.string().min(1, 'Selecione um contato'),
  valor: z.number().positive('Informe um valor válido'),
});

export type CriarContratoInput = z.infer<typeof criarContratoSchema>;
