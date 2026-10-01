import { z } from 'zod';

export const userProfileSchema = z.object({
  nome: z.string().min(2, 'Informe o nome completo'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().optional(),
  dataNascimento: z.string().optional(),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;

export const updateMetaSchema = z.object({
  metaMensal: z.number().nonnegative('A meta não pode ser negativa'),
});

export type UpdateMetaInput = z.infer<typeof updateMetaSchema>;
