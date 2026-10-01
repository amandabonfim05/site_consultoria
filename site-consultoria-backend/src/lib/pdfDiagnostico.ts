import PDFDocument from 'pdfkit';

const NAVY = '#0a2540';
const GOLD = '#f4b942';
const SLATE = '#5b6674';
const SUCCESS = '#2f7a55';
const DANGER = '#c23b32';
const LIGHT_BG = '#f3f4f7';
const CORES_CATEGORIAS = [NAVY, GOLD, SLATE, SUCCESS, DANGER];

const MARGIN = 50;
const PAGE_WIDTH = 595.28;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

export interface CategoriaDiagnostico {
  label: string;
  value: number;
  max: number;
}

export interface GerarPdfDiagnosticoOptions {
  nomeCliente: string;
  nomeConsultor: string;
  nota: number;
  perfil: string;
  categorias: CategoriaDiagnostico[];
  imagemGraficoBase64: string;
}

type Faixa = 'baixo' | 'medio' | 'alto';

const TEXTOS: Record<string, Record<Faixa, string>> = {
  'Organização Financeira': {
    baixo:
      'Sua organização financeira ainda está no início. Isso significa que o controle das ' +
      'entradas e saídas do seu dinheiro no dia a dia precisa de mais atenção. Sem esse controle, ' +
      'fica difícil saber exatamente para onde o dinheiro está indo e identificar oportunidades de ' +
      'economia. O primeiro passo recomendado é registrar todos os seus gastos por pelo menos 30 ' +
      'dias — isso já revela padrões importantes e é a base de qualquer planejamento financeiro sólido.',
    medio:
      'Você já tem uma organização financeira em desenvolvimento — alguns hábitos bons já estão ' +
      'presentes, mas ainda há espaço para evoluir. Manter um controle de gastos mais consistente e ' +
      'revisar o orçamento mensalmente vai trazer mais clareza sobre o que pode ser otimizado e vai ' +
      'acelerar o alcance dos seus objetivos financeiros.',
    alto:
      'Parabéns! Sua organização financeira está em um ótimo nível. Você já tem hábitos ' +
      'consolidados de controle de gastos e consegue enxergar com clareza seu fluxo de caixa ' +
      'mensal. Esse é um dos pilares mais importantes de qualquer planejamento financeiro de ' +
      'sucesso, e você já domina bem essa base.',
  },
  'Objetivos Financeiros': {
    baixo:
      'Seus objetivos financeiros ainda precisam ser mais bem definidos. Ter metas claras, com ' +
      'prazo e valor determinados, é o que transforma um desejo em um plano executável. ' +
      'Recomendamos dedicar um tempo para detalhar cada objetivo: o que você quer conquistar, até ' +
      'quando, e quanto isso custa — esse detalhamento por si só já aumenta muito as chances de sucesso.',
    medio:
      'Você já tem alguns objetivos financeiros bem estruturados, com prazo e valor definidos. O ' +
      'próximo passo é revisar periodicamente esse planejamento e garantir que as contribuições ' +
      'mensais estejam alinhadas com os prazos estabelecidos, para que as metas sigam no caminho certo.',
    alto:
      'Excelente! Seus objetivos financeiros estão muito bem definidos e detalhados, com prazos e ' +
      'valores claros. Essa clareza é um diferencial importante — ela permite acompanhar o ' +
      'progresso de cada meta e ajustar a rota quando necessário, mantendo você sempre no controle ' +
      'da sua jornada financeira.',
  },
  'Proteção Financeira': {
    baixo:
      'Sua proteção financeira e a de sua família merece atenção prioritária. Imprevistos ' +
      'acontecem, e sem as proteções adequadas (como plano de saúde, seguros e uma reserva de ' +
      'emergência), um evento inesperado pode comprometer seriamente todo o planejamento construído ' +
      'até aqui. Recomendamos avaliar com prioridade as coberturas essenciais para você e seus dependentes.',
    medio:
      'Você já conta com algumas proteções financeiras importantes, mas ainda há lacunas que ' +
      'merecem atenção. Revisar as coberturas existentes e considerar proteções adicionais (como ' +
      'seguro de vida ou proteção de renda) vai trazer mais segurança para você e sua família ' +
      'diante de imprevistos.',
    alto:
      'Muito bem! Sua estrutura de proteção financeira está sólida. Você já conta com as ' +
      'principais coberturas para lidar com imprevistos, o que traz tranquilidade para focar no ' +
      'crescimento do seu patrimônio sem o risco de que um evento inesperado comprometa tudo o que ' +
      'foi construído.',
  },
  'Expansão de Capital': {
    baixo:
      'A expansão do seu capital ainda está no começo. Investir de forma consistente é o que faz o ' +
      'dinheiro trabalhar para você ao longo do tempo, através dos juros compostos. Recomendamos ' +
      'começar, mesmo que com valores pequenos, e criar o hábito de investir uma parte da renda ' +
      'todos os meses — o tempo é o maior aliado nessa jornada.',
    medio:
      'Você já investe parte do seu dinheiro, o que é um ótimo começo. Para acelerar o crescimento ' +
      'do seu patrimônio, vale revisar se a diversificação dos investimentos está alinhada ao seu ' +
      'perfil de investidor e aos seus objetivos de prazo mais longo.',
    alto:
      'Muito bem! Você já tem uma estratégia consistente de expansão de capital, com investimentos ' +
      'regulares e diversificados. Isso mostra maturidade financeira e coloca você em uma posição ' +
      'privilegiada para atingir seus objetivos de longo prazo com mais tranquilidade.',
  },
  'Planejamento de Aposentadoria': {
    baixo:
      'O planejamento para sua aposentadoria ainda precisa ser iniciado com mais profundidade. ' +
      'Quanto antes esse planejamento começar, menor o esforço financeiro necessário para atingir a ' +
      'renda desejada no futuro, graças ao efeito dos juros compostos ao longo do tempo. ' +
      'Recomendamos definir uma idade-alvo e uma renda desejada para começar a traçar a estratégia.',
    medio:
      'Você já deu os primeiros passos no planejamento da sua aposentadoria, com algumas ' +
      'definições em andamento. Formalizar uma projeção mais detalhada, considerando a idade e a ' +
      'renda desejadas, vai trazer mais segurança sobre se o ritmo atual é suficiente para atingir ' +
      'esse objetivo.',
    alto:
      'Parabéns! Seu planejamento de aposentadoria está bem encaminhado, com estratégia e projeção ' +
      'definidas. Isso é um diferencial importante para garantir uma aposentadoria tranquila e ' +
      'alinhada ao padrão de vida que você deseja manter no futuro.',
  },
};

const PROXIMOS_PASSOS: Record<string, string[]> = {
  'Organização Financeira': [
    'Registre todos os seus gastos por pelo menos 30 dias seguidos.',
    'Separe as despesas em categorias fixas e variáveis.',
    'Revise seu orçamento no mesmo dia todo mês.',
  ],
  'Objetivos Financeiros': [
    'Liste seus objetivos em ordem de prioridade.',
    'Defina um valor e um prazo claro para cada um.',
    'Revise o progresso das metas a cada 3 meses.',
  ],
  'Proteção Financeira': [
    'Avalie se sua reserva de emergência cobre de 3 a 6 meses de despesas.',
    'Revise as coberturas do seu plano de saúde e seguros.',
    'Verifique se seus dependentes estão protegidos em caso de imprevistos.',
  ],
  'Expansão de Capital': [
    'Automatize um valor fixo de investimento todo mês.',
    'Revise se a diversificação combina com seu perfil de investidor.',
    'Acompanhe a rentabilidade dos seus investimentos trimestralmente.',
  ],
  'Planejamento de Aposentadoria': [
    'Defina a idade e a renda mensal desejada na aposentadoria.',
    'Simule quanto precisa investir por mês para atingir essa meta.',
    'Revise a projeção anualmente, ajustando conforme sua renda mude.',
  ],
};

function faixa(value: number, max: number): Faixa {
  const ratio = max > 0 ? value / max : 0;
  if (ratio < 0.4) return 'baixo';
  if (ratio < 0.75) return 'medio';
  return 'alto';
}

function corFaixa(f: Faixa): string {
  return { baixo: DANGER, medio: GOLD, alto: SUCCESS }[f];
}

function rotuloFaixa(f: Faixa): string {
  return { baixo: 'Atenção', medio: 'Em desenvolvimento', alto: 'Consolidado' }[f];
}

function desenharCabecalho(doc: PDFKit.PDFDocument) {
  doc.rect(0, 0, doc.page.width, 34).fill(NAVY);
  doc
    .fillColor('#ffffff')
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('SITE CONSULTORIA · Diagnóstico Financeiro', MARGIN, 12);
}

function desenharRodape(doc: PDFKit.PDFDocument, nomeConsultor: string, numeroPagina: number) {
  const margemInferiorOriginal = doc.page.margins.bottom;
  doc.page.margins.bottom = 0;

  doc
    .fillColor(SLATE)
    .font('Helvetica')
    .fontSize(8)
    .text(`Página ${numeroPagina}  ·  Consultor(a): ${nomeConsultor}`, 0, doc.page.height - 30, {
      width: doc.page.width,
      align: 'center',
      lineBreak: false,
    });

  doc.page.margins.bottom = margemInferiorOriginal;
}

function novaPagina(doc: PDFKit.PDFDocument, nomeConsultor: string, numeroPagina: number) {
  doc.addPage();
  desenharCabecalho(doc);
  desenharRodape(doc, nomeConsultor, numeroPagina);
  doc.x = MARGIN;
  doc.y = 60;
}

export async function gerarPdfDiagnostico(options: GerarPdfDiagnosticoOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 60, bottom: 50, left: MARGIN, right: MARGIN } });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    let pagina = 1;

    desenharCabecalho(doc);
    desenharRodape(doc, options.nomeConsultor, pagina);
    doc.x = MARGIN;

    doc.y = 220;
    doc.fillColor(NAVY).font('Helvetica-Bold').fontSize(28).text('Diagnóstico Financeiro', {
      align: 'center',
    });
    doc.moveDown(0.4);
    doc
      .fillColor(SLATE)
      .font('Helvetica')
      .fontSize(13)
      .text(`Preparado para ${options.nomeCliente}`, { align: 'center' });

    doc.moveDown(2.5);
    doc.fillColor(NAVY).font('Helvetica-Bold').fontSize(48).text(String(options.nota), {
      align: 'center',
    });
    doc.fillColor(SLATE).font('Helvetica').fontSize(13).text('de 100 pontos', { align: 'center' });
    doc.moveDown(0.5);
    doc.fillColor(GOLD).font('Helvetica-Bold').fontSize(16).text(options.perfil, { align: 'center' });

    doc.moveDown(1.5);
    const lineY = doc.y;
    doc
      .strokeColor('#d9d9d9')
      .lineWidth(1)
      .moveTo(doc.page.width / 2 - 150, lineY)
      .lineTo(doc.page.width / 2 + 150, lineY)
      .stroke();

    doc.moveDown(1.5);
    doc
      .fillColor('#1a1a1a')
      .font('Helvetica')
      .fontSize(10.5)
      .text(
        'Este relatório apresenta uma visão completa da sua situação financeira atual, organizada ' +
          'em 5 pilares. Cada seção traz uma análise personalizada com base nas informações ' +
          'fornecidas durante a consultoria.',
        { align: 'center' }
      );

    options.categorias.forEach((cat, idx) => {
      pagina += 1;
      novaPagina(doc, options.nomeConsultor, pagina);

      const f = faixa(cat.value, cat.max);
      const cor = corFaixa(f);
      const rotulo = rotuloFaixa(f);

      doc
        .fillColor(NAVY)
        .font('Helvetica-Bold')
        .fontSize(20)
        .text(`${idx + 1}. ${cat.label}`);
      doc.moveDown(0.7);

      const badgeY = doc.y;
      doc.roundedRect(MARGIN, badgeY, 130, 22, 4).fill(LIGHT_BG);
      doc
        .fillColor(NAVY)
        .font('Helvetica-Bold')
        .fontSize(9.5)
        .text(`Pontuação: ${cat.value}/${cat.max}`, MARGIN, badgeY + 6, { width: 130, align: 'center' });

      doc.roundedRect(MARGIN + 140, badgeY, 130, 22, 4).fill(cor);
      doc
        .fillColor('#ffffff')
        .font('Helvetica-Bold')
        .fontSize(9.5)
        .text(rotulo, MARGIN + 140, badgeY + 6, { width: 130, align: 'center' });

      doc.x = MARGIN;
      doc.y = badgeY + 36;

      const texto = TEXTOS[cat.label][f];
      doc
        .fillColor('#1a1a1a')
        .font('Helvetica')
        .fontSize(11.5)
        .text(texto, { width: CONTENT_WIDTH, lineGap: 4 });

      doc.moveDown(1.2);
      doc.x = MARGIN;
      doc.fillColor(NAVY).font('Helvetica-Bold').fontSize(12.5).text('Próximos passos recomendados');
      doc.moveDown(0.5);

      PROXIMOS_PASSOS[cat.label].forEach((passo) => {
        doc.x = MARGIN;
        doc
          .fillColor('#1a1a1a')
          .font('Helvetica')
          .fontSize(11.5)
          .text(`•  ${passo}`, { width: CONTENT_WIDTH - 14, indent: 14, lineGap: 3 });
        doc.moveDown(0.3);
      });
    });

    pagina += 1;
    novaPagina(doc, options.nomeConsultor, pagina);

    doc.fillColor(NAVY).font('Helvetica-Bold').fontSize(20).text('Resumo Visual');
    doc.moveDown(0.5);
    doc.x = MARGIN;
    doc
      .fillColor(SLATE)
      .font('Helvetica')
      .fontSize(10.5)
      .text(
        'A distribuição abaixo resume visualmente sua pontuação em cada um dos 5 pilares avaliados ' +
          'neste diagnóstico.',
        { width: CONTENT_WIDTH }
      );
    doc.moveDown(1.2);

    try {
      const base64Data = options.imagemGraficoBase64.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      const imageSize = 220;
      const imageX = (doc.page.width - imageSize) / 2;
      doc.image(imageBuffer, imageX, doc.y, { width: imageSize, height: imageSize });
      doc.y += imageSize + 24;
    } catch {
      doc
        .fillColor(SLATE)
        .font('Helvetica')
        .fontSize(10)
        .text('(não foi possível carregar a imagem do gráfico)', { width: CONTENT_WIDTH });
      doc.moveDown(1);
    }

    doc.x = MARGIN;
    options.categorias.forEach((cat, idx) => {
      const cor = CORES_CATEGORIAS[idx % CORES_CATEGORIAS.length];
      const rowY = doc.y;
      doc.rect(MARGIN, rowY + 2, 10, 10).fill(cor);
      doc
        .fillColor('#1a1a1a')
        .font('Helvetica')
        .fontSize(11)
        .text(`${cat.label} — ${cat.value}/${cat.max}`, MARGIN + 18, rowY);
      doc.moveDown(0.55);
      doc.x = MARGIN;
    });

    doc.moveDown(1.2);
    const disclaimerLineY = doc.y;
    doc
      .strokeColor('#d9d9d9')
      .lineWidth(1)
      .moveTo(MARGIN, disclaimerLineY)
      .lineTo(doc.page.width - MARGIN, disclaimerLineY)
      .stroke();
    doc.moveDown(0.6);
    doc.x = MARGIN;
    doc
      .fillColor(SLATE)
      .font('Helvetica')
      .fontSize(9)
      .text(
        'Este relatório é uma ferramenta de apoio à decisão e não substitui o acompanhamento ' +
          'contínuo do seu consultor financeiro. Fale com seu consultor para aprofundar qualquer um ' +
          'dos pontos apresentados aqui.',
        { width: CONTENT_WIDTH }
      );

    doc.end();
  });
}