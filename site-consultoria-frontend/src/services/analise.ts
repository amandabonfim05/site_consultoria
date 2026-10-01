import { api } from './api';
import {
  calcularValorConsultoria,
  PLANOS_ACOMPANHAMENTO,
  type AnaliseWizardData,
} from '../types/analise';

function formatarMoeda(valor: number): string {
  return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function nomeDoPlano(id: AnaliseWizardData['plano']['planoSelecionado']): string {
  return PLANOS_ACOMPANHAMENTO.find((p) => p.id === id)?.nome ?? '';
}

function nomeFormaPagamento(forma: AnaliseWizardData['plano']['formaPagamento']): string {
  return forma === 'parcelado' ? 'Parcelado' : 'À vista';
}

function montarRelatorio(data: AnaliseWizardData, calculo: ReturnType<typeof calcularValorConsultoria>) {
  return {
    nomeCliente: data.nomeCliente || 'Cliente',
    telefoneCliente: data.telefoneCliente,
    valorConsultoria: {
      rendaBrutaAnual: data.plano.rendaBrutaAnual ? `R$ ${data.plano.rendaBrutaAnual}` : '',
      cupom: data.plano.cupom,
      descontoPercentual: calculo.desconto,
      formaPagamento: nomeFormaPagamento(data.plano.formaPagamento),
      planoSelecionado: nomeDoPlano(data.plano.planoSelecionado),
      valorFinal: formatarMoeda(calculo.valorFinal),
      parcelas: calculo.parcelas,
      valorParcela: formatarMoeda(calculo.valorParcela),
    },
    objetivos: data.objetivos.map((o) => ({
      nome: o.nome,
      motivo: o.motivo,
      prazo: o.prazo,
      valorNecessario: o.valorNecessario,
      valorGuardado: o.possuiValorGuardado === 'Sim' ? o.valorGuardado : '',
      estrategia: o.estrategia,
    })),
    situacaoProfissional: data.situacaoProfissional,
    patrimonio: {
      capacidadeMinimaPoupar: data.patrimonio.capacidadeMinimaPoupar,
      capacidadeMaximaPoupar: data.patrimonio.capacidadeMaximaPoupar,
      instituicaoPrincipal: data.patrimonio.instituicaoPrincipal,
      todasInstituicoes: data.patrimonio.todasInstituicoes,
      perfilInvestidor: data.patrimonio.perfilInvestidor,
      moradiaAtual: data.patrimonio.moradiaAtual,
      automoveis: data.patrimonio.automoveis,
      aplicacoesFinanceiras: data.patrimonio.aplicacoesFinanceiras,
      dividas: data.patrimonio.dividas,
      outrosBens: data.patrimonio.outrosBens,
    },
    imoveis: data.patrimonio.imoveis.map((i) => ({ descricao: i.descricao, valor: i.valor })),
    protecaoFinanceira: data.protecaoFinanceira,
    aposentadoria: data.aposentadoria,
    orcamento: {
      habitos: {
        formaGastos: data.orcamento.formaGastos,
        parcelaGastos: data.orcamento.parcelaGastos,
        fazControleGastos: data.orcamento.fazControleGastos,
        investeMensalmente: data.orcamento.investeMensalmente,
        conheceMilhas: data.orcamento.conheceMilhas,
      },
      cartoes: data.orcamento.cartoes.map((c) => ({
        nome: c.nome,
        limiteTotal: c.limiteTotal,
        limiteDisponivel: c.limiteDisponivel,
      })),
      renda: data.orcamento.renda,
      gastosFixos: data.orcamento.gastosFixos,
      gastosVariaveis: data.orcamento.gastosVariaveis,
      protecao: data.orcamento.protecao,
      investimentos: data.orcamento.investimentos,
    },
    recomendacoes: data.recomendacoes.map((r) => ({
      nome: r.nome,
      celular: r.celular,
      profissao: r.profissao,
      circuloSocial: r.circuloSocial,
      comentario: r.comentario,
    })),
  };
}

export async function submeterAnalise(data: AnaliseWizardData, contatoId?: string): Promise<void> {
  const calculo = calcularValorConsultoria(data);

  await api.post('/analises', {
    status: data.statusAnalise || 'EM_ANDAMENTO',
    valorEstimado: calculo.valorFinal > 0 ? Number(calculo.valorFinal.toFixed(2)) : undefined,
    contatoId,
    relatorio: montarRelatorio(data, calculo),
  });
}