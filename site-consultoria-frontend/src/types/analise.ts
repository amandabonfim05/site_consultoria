import { paraNumero } from '../utils/moeda';

export interface ObjetivoFinanceiro {
  id: string;
  nome: string;
  prioridade: number;
  motivo: string;
  prazo: string;
  valorNecessario: string;
  possuiValorGuardado: string;
  valorGuardado: string;
  estrategia: string;
}

export interface Imovel {
  id: string;
  descricao: string;
  valor: string;
}

export interface CartaoCredito {
  id: string;
  nome: string;
  descricao: string;
  limiteTotal: string;
  limiteDisponivel: string;
}

export interface Recomendacao {
  id: string;
  nome: string;
  celular: string;
  genero: string;
  circuloSocial: string;
  estadoCivil: string;
  filhos: string;
  profissao: string;
  comentario: string;
}

export interface AnaliseWizardData {
  nomeCliente: string;
  telefoneCliente: string;

  objetivos: ObjetivoFinanceiro[];

  situacaoProfissional: {
    profissao: string;
    regimeTrabalho: string;
  };

  patrimonio: {
    capacidadeMinimaPoupar: string;
    capacidadeMaximaPoupar: string;
    instituicaoPrincipal: string;
    todasInstituicoes: string;
    perfilInvestidor: string;
    moradiaAtual: string;
    imoveis: Imovel[];
    automoveis: string;
    aplicacoesFinanceiras: string;
    dividas: string;
    outrosBens: string;
  };

  protecaoFinanceira: {
    estadoCivil: string;
    possuiFilhos: string;
    possuiPets: string;
    conjugeNome: string;
    conjugeDataNascimento: string;
    conjugeTipoPartilha: string;
    conjugeProfissao: string;
    conjugeGenero: string;
    possuiPlanoSaude: string;
    possuiProtecaoTrabalho: string;
    possuiProtecaoDependentes: string;
    possuiSeguroTrabalho: string;
    conheceSucessao: string;
    possuiEstrategiaSucessao: string;
  };

  aposentadoria: {
    declaracaoIR: string;
    conheceVantagensTributarias: string;
    dataNascimento: string;
    jaAposentado: string;
    idadeDesejada: string;
    rendaDesejada: string;
    possuiEstrategia: string;
    jaFezProjecao: string;
  };

  orcamento: {
    formaGastos: string;
    parcelaGastos: string;
    cartoes: CartaoCredito[];
    fazControleGastos: string;
    investeMensalmente: string;
    conheceMilhas: string;
    renda: Record<string, string>;
    gastosFixos: Record<string, string>;
    gastosVariaveis: Record<string, string>;
    protecao: string;
    investimentos: string;
    capacidadePouparInformada: string;
  };

  recomendacoes: Recomendacao[];

  statusAnalise: 'EM_ANDAMENTO' | 'APROVADA' | 'REPROVADA';

  plano: {
    rendaBrutaAnual: string;
    cupom: string;
    formaPagamento: 'avista' | 'parcelado';
    planoSelecionado: 'standard' | 'premium' | 'infinity' | '';
  };
}

export const RENDA_CATEGORIAS = [
  'Pró-labore',
  'Salário',
  'Recebimento Aluguel',
  'Aposentadoria',
  'Retorno investimentos',
];

export const GASTOS_FIXOS_CATEGORIAS = [
  'Filhos',
  'Pet',
  'Serviços de terceiros',
  'Automóvel',
  'Habilitação',
  'Saúde',
  'Dívidas',
  'Contas Residenciais',
  'Seguros',
  'Educação',
  'Assinaturas',
  'Dízimo',
  'Taxas',
];

export const GASTOS_VARIAVEIS_CATEGORIAS = [
  'Farmácia',
  'Compras',
  'Viagens',
  'Transporte',
  'Lazer',
  'Presentes',
  'Doações',
  'Estética e beleza',
];

export const OBJETIVOS_DISPONIVEIS = [
  'Aquisição de Imóvel',
  'Aquisição de Veículo',
  'Reserva de Emergência',
  'Viagem dos Sonhos',
  'Educação dos Filhos',
  'Aposentadoria Antecipada',
  'Abertura de Negócio',
  'Quitação de Dívidas',
  'Planejamento Sucessório',
  'Independência Financeira',
  'Casamento',
  'Outro',
];

export const PLANOS_ACOMPANHAMENTO = [
  {
    id: 'standard' as const,
    nome: 'Standard',
    preco: 149.9,
    beneficios: ['4 reuniões de acompanhamento', 'Relatórios Quinzenais', 'Clube de descontos'],
  },
  {
    id: 'premium' as const,
    nome: 'Premium',
    preco: 199.9,
    beneficios: ['8 reuniões de acompanhamento', 'Relatórios Semanais', 'Clube de descontos'],
  },
  {
    id: 'infinity' as const,
    nome: 'Infinity',
    preco: 349.9,
    beneficios: ['10 reuniões de acompanhamento', 'Relatórios Diários', 'Clube de descontos'],
  },
];

export function extrairDescontoDoCupom(cupom: string): number {
  if (!cupom || cupom.length < 2) return 0;
  const ultimosDois = cupom.trim().slice(-2);
  return /^\d{2}$/.test(ultimosDois) ? Number(ultimosDois) : 0;
}

export interface CalculoValorConsultoria {
  base: number;
  precoPlano: number;
  subtotal: number;
  desconto: number;
  acrescimoParcelamento: number;
  valorFinal: number;
  parcelas: number;
  valorParcela: number;
}

export function calcularValorConsultoria(data: AnaliseWizardData): CalculoValorConsultoria {
  const base = paraNumero(data.plano.rendaBrutaAnual) * 0.02;
  const planoEscolhido = PLANOS_ACOMPANHAMENTO.find((p) => p.id === data.plano.planoSelecionado);
  const precoPlano = planoEscolhido?.preco ?? 0;
  const subtotal = base + precoPlano;
  const desconto = extrairDescontoDoCupom(data.plano.cupom);
  const valorComDesconto = subtotal * (1 - desconto / 100);
  const parcelado = data.plano.formaPagamento === 'parcelado';
  const acrescimoParcelamento = parcelado ? valorComDesconto * 0.02 : 0;
  const valorFinal = valorComDesconto + acrescimoParcelamento;
  const parcelas = parcelado ? 12 : 1;
  const valorParcela = valorFinal / parcelas;

  return { base, precoPlano, subtotal, desconto, acrescimoParcelamento, valorFinal, parcelas, valorParcela };
}

export function createEmptyAnaliseData(): AnaliseWizardData {
  const zerarCategorias = (categorias: string[]) =>
    Object.fromEntries(categorias.map((categoria) => [categoria, '']));

  return {
    nomeCliente: '',
    telefoneCliente: '',
    objetivos: [],
    situacaoProfissional: { profissao: '', regimeTrabalho: '' },
    patrimonio: {
      capacidadeMinimaPoupar: '',
      capacidadeMaximaPoupar: '',
      instituicaoPrincipal: '',
      todasInstituicoes: '',
      perfilInvestidor: '',
      moradiaAtual: '',
      imoveis: [],
      automoveis: '',
      aplicacoesFinanceiras: '',
      dividas: '',
      outrosBens: '',
    },
    protecaoFinanceira: {
      estadoCivil: '',
      possuiFilhos: '',
      possuiPets: '',
      conjugeNome: '',
      conjugeDataNascimento: '',
      conjugeTipoPartilha: '',
      conjugeProfissao: '',
      conjugeGenero: '',
      possuiPlanoSaude: '',
      possuiProtecaoTrabalho: '',
      possuiProtecaoDependentes: '',
      possuiSeguroTrabalho: '',
      conheceSucessao: '',
      possuiEstrategiaSucessao: '',
    },
    aposentadoria: {
      declaracaoIR: '',
      conheceVantagensTributarias: '',
      dataNascimento: '',
      jaAposentado: '',
      idadeDesejada: '',
      rendaDesejada: '',
      possuiEstrategia: '',
      jaFezProjecao: '',
    },
    orcamento: {
      formaGastos: '',
      parcelaGastos: '',
      cartoes: [],
      fazControleGastos: '',
      investeMensalmente: '',
      conheceMilhas: '',
      renda: zerarCategorias(RENDA_CATEGORIAS),
      gastosFixos: zerarCategorias(GASTOS_FIXOS_CATEGORIAS),
      gastosVariaveis: zerarCategorias(GASTOS_VARIAVEIS_CATEGORIAS),
      protecao: '',
      investimentos: '',
      capacidadePouparInformada: '',
    },
    recomendacoes: [],
    statusAnalise: 'EM_ANDAMENTO',
    plano: {
      rendaBrutaAnual: '',
      cupom: '',
      formaPagamento: 'avista',
      planoSelecionado: '',
    },
  };
}
