import PDFDocument from 'pdfkit';

const NAVY = '#0a2540';
const GOLD = '#f4b942';
const SLATE = '#5b6674';
const LIGHT_BG = '#f3f4f7';
const BORDER = '#e2e5e9';

const MARGIN = 50;
const PAGE_WIDTH = 595.28;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

export interface AnaliseCompletaOptions {
  nomeCliente: string;
  telefoneCliente: string;
  nomeConsultor: string;
  dataAnalise: string;
  statusAnalise: string;
  valorConsultoria: {
    rendaBrutaAnual: string;
    cupom: string;
    descontoPercentual: number;
    formaPagamento: string;
    planoSelecionado: string;
    valorFinal: string;
    parcelas: number;
    valorParcela: string;
  };
  objetivos: {
    nome: string;
    motivo: string;
    prazo: string;
    valorNecessario: string;
    valorGuardado: string;
    estrategia: string;
  }[];
  situacaoProfissional: { profissao: string; regimeTrabalho: string };
  patrimonio: Record<string, string>;
  imoveis: { descricao: string; valor: string }[];
  protecaoFinanceira: Record<string, string>;
  aposentadoria: Record<string, string>;
  orcamento: {
    habitos: Record<string, string>;
    cartoes: { nome: string; limiteTotal: string; limiteDisponivel: string }[];
    renda: Record<string, string>;
    gastosFixos: Record<string, string>;
    gastosVariaveis: Record<string, string>;
    protecao: string;
    investimentos: string;
  };
  recomendacoes: {
    nome: string;
    celular: string;
    profissao: string;
    circuloSocial: string;
    comentario: string;
  }[];
}

function moeda(valor: string): string {
  if (!valor || valor.trim() === '') return '';
  if (valor.includes('R$')) return valor;
  const numero = Number(valor.replace(/\./g, '').replace(',', '.'));
  if (Number.isNaN(numero)) return valor;
  return `R$ ${numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

class Escritor {
  private pagina = 1;

  constructor(private doc: PDFKit.PDFDocument, private nomeConsultor: string) {
    this.cabecalho();
    this.rodape();
    this.doc.x = MARGIN;
    this.doc.y = 58;
  }

  private cabecalho() {
    this.doc.rect(0, 0, this.doc.page.width, 34).fill(NAVY);
    this.doc
      .fillColor('#ffffff')
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('SITE CONSULTORIA · Relatório Completo da Análise', MARGIN, 12);
  }

  private rodape() {
    const original = this.doc.page.margins.bottom;
    this.doc.page.margins.bottom = 0;
    this.doc
      .fillColor(SLATE)
      .font('Helvetica')
      .fontSize(8)
      .text(
        `Página ${this.pagina}  ·  Consultor(a): ${this.nomeConsultor}`,
        0,
        this.doc.page.height - 30,
        { width: this.doc.page.width, align: 'center', lineBreak: false }
      );
    this.doc.page.margins.bottom = original;
  }

  novaPagina() {
    this.doc.addPage();
    this.pagina += 1;
    this.cabecalho();
    this.rodape();
    this.doc.x = MARGIN;
    this.doc.y = 58;
  }

  garantirEspaco(altura: number) {
    if (this.doc.y + altura > this.doc.page.height - 60) {
      this.novaPagina();
    }
  }

  tituloSecao(texto: string) {
    this.garantirEspaco(60);
    this.doc.x = MARGIN;
    this.doc.fillColor(NAVY).font('Helvetica-Bold').fontSize(17).text(texto);
    const y = this.doc.y + 4;
    this.doc.strokeColor(GOLD).lineWidth(2).moveTo(MARGIN, y).lineTo(MARGIN + 46, y).stroke();
    this.doc.y = y + 14;
    this.doc.x = MARGIN;
  }

  subtitulo(texto: string) {
    this.garantirEspaco(40);
    this.doc.x = MARGIN;
    this.doc.fillColor(NAVY).font('Helvetica-Bold').fontSize(12).text(texto);
    this.doc.moveDown(0.4);
    this.doc.x = MARGIN;
  }

  campo(rotulo: string, valor: string) {
    this.garantirEspaco(22);
    const y = this.doc.y;
    const valorTexto = valor && valor.trim() !== '' ? valor : '—';

    this.doc
      .fillColor(SLATE)
      .font('Helvetica')
      .fontSize(10)
      .text(rotulo, MARGIN, y, { width: CONTENT_WIDTH * 0.52, lineBreak: false });

    this.doc
      .fillColor('#1a1a1a')
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(valorTexto, MARGIN + CONTENT_WIDTH * 0.54, y, {
        width: CONTENT_WIDTH * 0.46,
        align: 'right',
      });

    this.doc.y = Math.max(this.doc.y, y + 14);
    this.doc.x = MARGIN;
  }

  paragrafo(rotulo: string, texto: string) {
    if (!texto || texto.trim() === '') return;
    this.garantirEspaco(46);
    this.doc.x = MARGIN;
    this.doc.fillColor(SLATE).font('Helvetica').fontSize(9.5).text(rotulo);
    this.doc.x = MARGIN;
    this.doc
      .fillColor('#1a1a1a')
      .font('Helvetica')
      .fontSize(10.5)
      .text(texto, { width: CONTENT_WIDTH, lineGap: 2 });
    this.doc.moveDown(0.5);
    this.doc.x = MARGIN;
  }

  tabelaValores(itens: Record<string, string>, rotuloTotal = 'Total') {
    const preenchidos = Object.entries(itens).filter(
      ([, v]) => v && v.trim() !== '' && Number(v.replace(',', '.')) !== 0
    );

    if (preenchidos.length === 0) {
      this.garantirEspaco(20);
      this.doc.x = MARGIN;
      this.doc.fillColor(SLATE).font('Helvetica-Oblique').fontSize(10).text('Nada informado.');
      this.doc.moveDown(0.6);
      this.doc.x = MARGIN;
      return;
    }

    let total = 0;
    preenchidos.forEach(([categoria, valor]) => {
      const numero = Number(valor.replace(',', '.')) || 0;
      total += numero;

      this.garantirEspaco(20);
      const y = this.doc.y;
      this.doc.rect(MARGIN, y - 2, CONTENT_WIDTH, 17).fill(LIGHT_BG);
      this.doc
        .fillColor('#1a1a1a')
        .font('Helvetica')
        .fontSize(10)
        .text(categoria, MARGIN + 8, y + 2, { width: CONTENT_WIDTH * 0.6, lineBreak: false });
      this.doc
        .fillColor('#1a1a1a')
        .font('Helvetica-Bold')
        .fontSize(10)
        .text(`R$ ${numero.toFixed(2).replace('.', ',')}`, MARGIN, y + 2, {
          width: CONTENT_WIDTH - 8,
          align: 'right',
        });
      this.doc.y = y + 19;
      this.doc.x = MARGIN;
    });

    this.garantirEspaco(24);
    const yTotal = this.doc.y + 2;
    this.doc.strokeColor(BORDER).lineWidth(1).moveTo(MARGIN, yTotal).lineTo(MARGIN + CONTENT_WIDTH, yTotal).stroke();
    this.doc
      .fillColor(NAVY)
      .font('Helvetica-Bold')
      .fontSize(11)
      .text(rotuloTotal, MARGIN + 8, yTotal + 6, { width: CONTENT_WIDTH * 0.6, lineBreak: false });
    this.doc
      .fillColor(NAVY)
      .font('Helvetica-Bold')
      .fontSize(11)
      .text(`R$ ${total.toFixed(2).replace('.', ',')}`, MARGIN, yTotal + 6, {
        width: CONTENT_WIDTH - 8,
        align: 'right',
      });
    this.doc.y = yTotal + 26;
    this.doc.x = MARGIN;
  }

  cartaoNumerado(indice: number, titulo: string) {
    this.garantirEspaco(36);
    const y = this.doc.y;
    this.doc.circle(MARGIN + 8, y + 8, 8).fill(GOLD);
    this.doc
      .fillColor(NAVY)
      .font('Helvetica-Bold')
      .fontSize(9)
      .text(String(indice), MARGIN, y + 5, { width: 16, align: 'center' });
    this.doc
      .fillColor(NAVY)
      .font('Helvetica-Bold')
      .fontSize(12.5)
      .text(titulo, MARGIN + 24, y + 3, { width: CONTENT_WIDTH - 24 });
    this.doc.y = Math.max(this.doc.y, y + 22);
    this.doc.x = MARGIN;
  }

  espaco(n = 1) {
    this.doc.moveDown(n);
    this.doc.x = MARGIN;
  }

  vazio(mensagem: string) {
    this.garantirEspaco(20);
    this.doc.x = MARGIN;
    this.doc.fillColor(SLATE).font('Helvetica-Oblique').fontSize(10).text(mensagem);
    this.doc.moveDown(0.6);
    this.doc.x = MARGIN;
  }
}

export async function gerarPdfAnaliseCompleta(o: AnaliseCompletaOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 58, bottom: 60, left: MARGIN, right: MARGIN },
    });
    const chunks: Buffer[] = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const w = new Escritor(doc, o.nomeConsultor);

    doc.y = 190;
    doc.fillColor(NAVY).font('Helvetica-Bold').fontSize(26).text('Relatório Completo da Análise', {
      align: 'center',
    });
    doc.moveDown(0.3);
    doc.fillColor(SLATE).font('Helvetica').fontSize(13).text(o.nomeCliente, { align: 'center' });
    doc.moveDown(2);

    const boxY = doc.y;
    doc.roundedRect(MARGIN + 60, boxY, CONTENT_WIDTH - 120, 96, 8).fill(LIGHT_BG);
    doc.x = MARGIN + 80;
    doc.y = boxY + 14;
    const resumoCapa: [string, string][] = [
      ['Telefone', o.telefoneCliente],
      ['Data da análise', o.dataAnalise],
      ['Status', o.statusAnalise],
      ['Valor da consultoria', o.valorConsultoria.valorFinal],
    ];
    resumoCapa.forEach(([rotulo, valor]) => {
      const y = doc.y;
      doc.fillColor(SLATE).font('Helvetica').fontSize(10).text(rotulo, MARGIN + 80, y, {
        width: 160,
        lineBreak: false,
      });
      doc
        .fillColor(NAVY)
        .font('Helvetica-Bold')
        .fontSize(10)
        .text(valor || '—', MARGIN + 80, y, { width: CONTENT_WIDTH - 200, align: 'right' });
      doc.y = y + 18;
    });

    doc.x = MARGIN;
    doc.y = boxY + 120;
    doc
      .fillColor(SLATE)
      .font('Helvetica')
      .fontSize(10)
      .text(
        'Este documento reúne todas as informações coletadas durante a análise financeira, ' +
          'organizadas por etapa, para arquivo e acompanhamento do consultor.',
        { width: CONTENT_WIDTH, align: 'center' }
      );

    w.novaPagina();
    w.tituloSecao('1. Objetivos Financeiros');
    if (o.objetivos.length === 0) {
      w.vazio('Nenhum objetivo informado.');
    } else {
      o.objetivos.forEach((obj, i) => {
        w.cartaoNumerado(i + 1, obj.nome);
        w.campo('Prazo desejado', obj.prazo);
        w.campo('Valor necessário', moeda(obj.valorNecessario));
        w.campo('Valor já guardado', moeda(obj.valorGuardado));
        w.paragrafo('Por que é prioridade:', obj.motivo);
        w.paragrafo('Como pretende realizar:', obj.estrategia);
        w.espaco(0.6);
      });
    }

    w.novaPagina();
    w.tituloSecao('2. Situação Profissional');
    w.campo('Profissão', o.situacaoProfissional.profissao);
    w.campo('Regime de trabalho', o.situacaoProfissional.regimeTrabalho);

    w.espaco(1.5);
    w.tituloSecao('3. Patrimônio e Dívidas');
    w.subtitulo('Capacidade de poupança');
    w.campo('Capacidade mínima de poupar', moeda(o.patrimonio.capacidadeMinimaPoupar));
    w.campo('Capacidade máxima de poupar', moeda(o.patrimonio.capacidadeMaximaPoupar));

    w.espaco(0.6);
    w.subtitulo('Perfil e instituições');
    w.campo('Instituição financeira principal', o.patrimonio.instituicaoPrincipal);
    w.campo('Todas as instituições', o.patrimonio.todasInstituicoes);
    w.campo('Perfil de investidor', o.patrimonio.perfilInvestidor);
    w.campo('Situação da moradia', o.patrimonio.moradiaAtual);

    w.espaco(0.6);
    w.subtitulo('Imóveis cadastrados');
    if (o.imoveis.length === 0) {
      w.vazio('Nenhum imóvel cadastrado.');
    } else {
      o.imoveis.forEach((imovel) => w.campo(imovel.descricao || 'Imóvel', moeda(imovel.valor)));
    }

    w.espaco(0.6);
    w.subtitulo('Resumo patrimonial');
    w.campo('Automóveis', moeda(o.patrimonio.automoveis));
    w.campo('Aplicações financeiras', moeda(o.patrimonio.aplicacoesFinanceiras));
    w.campo('Outros bens', moeda(o.patrimonio.outrosBens));
    w.campo('Dívidas', moeda(o.patrimonio.dividas));

    w.novaPagina();
    w.tituloSecao('4. Proteção Financeira');
    w.subtitulo('Informações familiares');
    w.campo('Estado civil', o.protecaoFinanceira.estadoCivil);
    w.campo('Possui filhos', o.protecaoFinanceira.possuiFilhos);
    w.campo('Possui pets', o.protecaoFinanceira.possuiPets);

    if (o.protecaoFinanceira.conjugeNome) {
      w.espaco(0.6);
      w.subtitulo('Cônjuge');
      w.campo('Nome', o.protecaoFinanceira.conjugeNome);
      w.campo('Data de nascimento', o.protecaoFinanceira.conjugeDataNascimento);
      w.campo('Profissão', o.protecaoFinanceira.conjugeProfissao);
      w.campo('Tipo de partilha', o.protecaoFinanceira.conjugeTipoPartilha);
    }

    w.espaco(0.6);
    w.subtitulo('Coberturas e estratégias');
    w.campo('Possui plano de saúde', o.protecaoFinanceira.possuiPlanoSaude);
    w.campo('Proteção da força de trabalho', o.protecaoFinanceira.possuiProtecaoTrabalho);
    w.campo('Proteção para dependentes', o.protecaoFinanceira.possuiProtecaoDependentes);
    w.campo('Seguro de bens do trabalho', o.protecaoFinanceira.possuiSeguroTrabalho);
    w.campo('Conhece sucessão patrimonial', o.protecaoFinanceira.conheceSucessao);
    w.campo('Estratégia de sucessão ativa', o.protecaoFinanceira.possuiEstrategiaSucessao);

    w.espaco(1.5);
    w.tituloSecao('5. Aposentadoria');
    w.campo('Última declaração de IR', o.aposentadoria.declaracaoIR);
    w.campo('Conhece vantagens tributárias', o.aposentadoria.conheceVantagensTributarias);
    w.campo('Data de nascimento', o.aposentadoria.dataNascimento);
    w.campo('Já está aposentado', o.aposentadoria.jaAposentado);
    w.campo('Idade desejada', o.aposentadoria.idadeDesejada);
    w.campo('Renda desejada', moeda(o.aposentadoria.rendaDesejada));
    w.campo('Possui estratégia', o.aposentadoria.possuiEstrategia);
    w.campo('Já fez projeção', o.aposentadoria.jaFezProjecao);

    w.novaPagina();
    w.tituloSecao('6. Orçamento');
    w.subtitulo('Hábitos de consumo');
    w.campo('Forma de gasto mais usada', o.orcamento.habitos.formaGastos);
    w.campo('Costuma parcelar', o.orcamento.habitos.parcelaGastos);
    w.campo('Faz controle de gastos', o.orcamento.habitos.fazControleGastos);
    w.campo('Investe mensalmente', o.orcamento.habitos.investeMensalmente);
    w.campo('Conhece estratégias de milhas', o.orcamento.habitos.conheceMilhas);

    w.espaco(0.6);
    w.subtitulo('Cartões de crédito');
    if (o.orcamento.cartoes.length === 0) {
      w.vazio('Nenhum cartão cadastrado.');
    } else {
      o.orcamento.cartoes.forEach((c) => {
        w.campo(`${c.nome || 'Cartão'} — limite total`, moeda(c.limiteTotal));
        w.campo(`${c.nome || 'Cartão'} — limite disponível`, moeda(c.limiteDisponivel));
      });
    }

    w.espaco(0.8);
    w.subtitulo('Renda mensal');
    w.tabelaValores(o.orcamento.renda, 'Total de renda');

    w.espaco(0.4);
    w.subtitulo('Gastos fixos');
    w.tabelaValores(o.orcamento.gastosFixos, 'Total de gastos fixos');

    w.espaco(0.4);
    w.subtitulo('Gastos variáveis');
    w.tabelaValores(o.orcamento.gastosVariaveis, 'Total de gastos variáveis');

    w.espaco(0.4);
    w.subtitulo('Proteção e investimentos');
    w.campo('Proteção (seguros)', moeda(o.orcamento.protecao));
    w.campo('Investimentos', moeda(o.orcamento.investimentos));

    w.novaPagina();
    w.tituloSecao('7. Recomendações');
    if (o.recomendacoes.length === 0) {
      w.vazio('Nenhuma recomendação informada.');
    } else {
      o.recomendacoes.forEach((r, i) => {
        w.cartaoNumerado(i + 1, r.nome);
        w.campo('Celular', r.celular);
        w.campo('Profissão', r.profissao);
        w.campo('Círculo social', r.circuloSocial);
        w.paragrafo('Comentário:', r.comentario);
        w.espaco(0.6);
      });
    }

    w.espaco(1.5);
    w.tituloSecao('8. Valor da Consultoria');
    const v = o.valorConsultoria;
    w.campo('Renda bruta anual', v.rendaBrutaAnual);
    w.campo('Plano de acompanhamento', v.planoSelecionado);
    w.campo('Cupom aplicado', v.cupom ? `${v.cupom} (${v.descontoPercentual}%)` : '');
    w.campo('Forma de pagamento', v.formaPagamento);
    if (v.parcelas > 1) {
      w.campo('Parcelamento', `${v.parcelas}x de ${v.valorParcela}`);
    }
    w.espaco(0.4);
    w.campo('VALOR FINAL', v.valorFinal);
    w.espaco(0.6);
    w.campo('Decisão da análise', o.statusAnalise);

    doc.end();
  });
}