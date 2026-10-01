import { z } from 'zod';

const objetivoSchema = z.object({
  nome: z.string(),
  motivo: z.string().optional().default(''),
  prazo: z.string().optional().default(''),
  valorNecessario: z.string().optional().default(''),
  valorGuardado: z.string().optional().default(''),
  estrategia: z.string().optional().default(''),
});

const imovelSchema = z.object({
  descricao: z.string().optional().default(''),
  valor: z.string().optional().default(''),
});

const cartaoSchema = z.object({
  nome: z.string().optional().default(''),
  limiteTotal: z.string().optional().default(''),
  limiteDisponivel: z.string().optional().default(''),
});

const recomendacaoSchema = z.object({
  nome: z.string(),
  celular: z.string().optional().default(''),
  profissao: z.string().optional().default(''),
  circuloSocial: z.string().optional().default(''),
  comentario: z.string().optional().default(''),
});

const grupoTextoSchema = z.record(z.string(), z.string());

const relatorioSchema = z.object({
  nomeCliente: z.string().optional().default('Cliente'),
  telefoneCliente: z.string().optional().default(''),
  valorConsultoria: z.object({
    rendaBrutaAnual: z.string().optional().default(''),
    cupom: z.string().optional().default(''),
    descontoPercentual: z.number().optional().default(0),
    formaPagamento: z.string().optional().default(''),
    planoSelecionado: z.string().optional().default(''),
    valorFinal: z.string().optional().default(''),
    parcelas: z.number().optional().default(1),
    valorParcela: z.string().optional().default(''),
  }),
  objetivos: z.array(objetivoSchema).default([]),
  situacaoProfissional: z
    .object({ profissao: z.string().optional().default(''), regimeTrabalho: z.string().optional().default('') })
    .default({ profissao: '', regimeTrabalho: '' }),
  patrimonio: grupoTextoSchema.default({}),
  imoveis: z.array(imovelSchema).default([]),
  protecaoFinanceira: grupoTextoSchema.default({}),
  aposentadoria: grupoTextoSchema.default({}),
  orcamento: z.object({
    habitos: grupoTextoSchema.default({}),
    cartoes: z.array(cartaoSchema).default([]),
    renda: grupoTextoSchema.default({}),
    gastosFixos: grupoTextoSchema.default({}),
    gastosVariaveis: grupoTextoSchema.default({}),
    protecao: z.string().optional().default(''),
    investimentos: z.string().optional().default(''),
  }),
  recomendacoes: z.array(recomendacaoSchema).default([]),
});

export const criarAnaliseSchema = z.object({
  status: z.enum(['EM_ANDAMENTO', 'APROVADA', 'REPROVADA']).default('EM_ANDAMENTO'),
  valorEstimado: z.number().nonnegative().optional(),
  contatoId: z.string().optional(),
  relatorio: relatorioSchema.optional(),
});

export type CriarAnaliseInput = z.infer<typeof criarAnaliseSchema>;
export type RelatorioInput = z.infer<typeof relatorioSchema>;