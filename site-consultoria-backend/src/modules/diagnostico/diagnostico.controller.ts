import type { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { getMailTransporter } from '../../lib/mailer';
import { gerarPdfDiagnostico } from '../../lib/pdfDiagnostico';
import { NotFoundError } from '../../utils/httpErrors';
import type { EnviarDiagnosticoEmailInput } from './diagnostico.schemas';

export async function enviarDiagnosticoEmail(req: Request, res: Response) {
  const body = req.body as EnviarDiagnosticoEmailInput;

  const consultor = await prisma.consultor.findUnique({ where: { id: req.consultorId } });
  if (!consultor) {
    throw new NotFoundError('Consultor não encontrado.');
  }

  const pdfBuffer = await gerarPdfDiagnostico({
    nomeCliente: body.nomeCliente?.trim() || 'Cliente',
    nomeConsultor: consultor.nome,
    nota: body.nota,
    perfil: body.perfil,
    categorias: body.categorias,
    imagemGraficoBase64: body.imagemBase64,
  });

  const transporter = getMailTransporter();

  await transporter.sendMail({
    from: `"${consultor.nome}" <${process.env.SMTP_USER}>`,
    replyTo: consultor.email,
    to: body.destinatario,
    subject: 'Análise financeira',
    text: 'Segue em anexo resumo da análise financeira',
    attachments: [
      {
        filename: 'analise-financeira.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });

  return res.status(200).json({ enviado: true });
}
