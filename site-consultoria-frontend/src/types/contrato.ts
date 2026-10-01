export interface ContratoContato {
  id: string;
  nome: string;
  telefone: string;
  profissao: string | null;
}

export interface Contrato {
  id: string;
  valor: number;
  fechadoEm: string;
  contato: ContratoContato;
}

export interface NovoContratoPayload {
  contatoId: string;
  valor: number;
}
