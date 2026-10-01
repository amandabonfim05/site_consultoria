import type { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { getMailTransporter } from '../../lib/mailer';
import { gerarPdfAnaliseCompleta } from '../../lib/pdfAnaliseCompleta';
import type { CriarAnaliseInput } from './analises.schemas';

function rotuloStatus(status: string): string {
  return { EM_ANDAMENTO: 'Em andamento', APROVADA: 'Aprovada', REPROVADA: 'Reprovada' }[status] ?? status;
}

export async function createAnalise(req: Request, res: Response) {
  const body = req.body as CriarAnaliseInput;
  const consultorId = req.consultorId!;

  const deveCriarContrato =
    body.status === 'APROVADA' && Boolean(body.contatoId) && Boolean(body.valorEstimado);

  const resultado = await prisma.$transaction(async (tx) => {
    const analise = await tx.analise.create({
      data: {
        status: body.status,
        valorEstimado: body.valorEstimado,
        contatoId: body.contatoId,
        consultorId,
      },
    });

    if (deveCriarContrato) {
      await tx.contrato.create({
        data: {
          valor: body.valorEstimado!,
          contatoId: body.contatoId!,
          consultorId,
        },
      });
    }

    return analise;
  });

  if (body.relatorio) {
    try {
      const consultor = await prisma.consultor.findUnique({ where: { id: consultorId } });

      if (consultor) {
        const pdfBuffer = await gerarPdfAnaliseCompleta({
          nomeCliente: body.relatorio.nomeCliente,
          telefoneCliente: body.relatorio.telefoneCliente,
          nomeConsultor: consultor.nome,
          dataAnalise: new Date().toLocaleDateString('pt-BR'),
          statusAnalise: rotuloStatus(body.status),
          valorConsultoria: body.relatorio.valorConsultoria,
          objetivos: body.relatorio.objetivos,
          situacaoProfissional: body.relatorio.situacaoProfissional,
          patrimonio: body.relatorio.patrimonio,
          imoveis: body.relatorio.imoveis,
          protecaoFinanceira: body.relatorio.protecaoFinanceira,
          aposentadoria: body.relatorio.aposentadoria,
          orcamento: body.relatorio.orcamento,
          recomendacoes: body.relatorio.recomendacoes,
        });

        const transporter = getMailTransporter();
        await transporter.sendMail({
          from: `"${consultor.nome}" <${process.env.SMTP_USER}>`,
          to: consultor.email,
          subject: `Relatório completo da análise · ${body.relatorio.nomeCliente}`,
          text:
            `Segue em anexo o relatório completo da análise financeira de ${body.relatorio.nomeCliente} ` +
            `(status: ${rotuloStatus(body.status)}).`,
          attachments: [
            {
              filename: 'relatorio-completo-analise.pdf',
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ],
        });
      }
    } catch (error) {

      console.error('Falha ao gerar/enviar o relatório completo da análise:', error);
    }
  }

  return res.status(201).json(resultado);
}