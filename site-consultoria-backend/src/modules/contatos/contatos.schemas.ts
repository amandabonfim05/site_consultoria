import { z } from 'zod';

export const contatoSchema = z.object({
  nome: z.string().min(2, 'Informe o nome do contato'),
  email: z.union([z.literal(''), z.string().email('E-mail inválido')]).optional(),
  telefone: z.string().optional(),
  dataNascimento: z.string().optional(),
  profissao: z.string().optional(),
  indicadoPor: z.string().optional(),
  detalhes: z.string().optional(),
});

export type ContatoInput = z.infer<typeof contatoSchema>;
