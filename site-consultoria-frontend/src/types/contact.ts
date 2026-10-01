export interface Contato {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento?: string;
  profissao?: string;
  indicadoPor?: string;
  detalhes?: string;
}

export type ContatoPayload = Omit<Contato, 'id'>;
