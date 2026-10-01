import type { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { NotFoundError, BadRequestError } from '../../utils/httpErrors';

function serializeContrato(contrato: {
  id: string;
  valor: unknown;
  fechadoEm: Date;
  contato: { id: string; nome: string; telefone: string; profissao: string | null } | null;
}) {
  return {
    id: contrato.id,
    valor: Number(contrato.valor),
    fechadoEm: contrato.fechadoEm,
    contato: contrato.contato
      ? {
          id: contrato.contato.id,
          nome: contrato.contato.nome,
          telefone: contrato.contato.telefone,
          profissao: contrato.contato.profissao ?? '',
        }
      : null,
  };
}

export async function listContratos(req: Request, res: Response) {
  const contratos = await prisma.contrato.findMany({
    where: { consultorId: req.consultorId },
    include: { contato: { select: { id: true, nome: true, telefone: true, profissao: true } } },
    orderBy: { fechadoEm: 'desc' },
  });

  return res.json(contratos.map(serializeContrato));
}

export async function getContrato(req: Request, res: Response) {
  const id = req.params.id as string;

  const contrato = await prisma.contrato.findFirst({
    where: { id, consultorId: req.consultorId },
    include: { contato: { select: { id: true, nome: true, telefone: true, profissao: true } } },
  });

  if (!contrato) {
    throw new NotFoundError('Contrato não encontrado.');
  }

  return res.json(serializeContrato(contrato));
}

export async function createContrato(req: Request, res: Response) {
  const body = req.body as { valor: number; contatoId: string };

  if (!body.contatoId || typeof body.valor !== 'number') {
    throw new BadRequestError('Informe contatoId e valor.');
  }

  const contato = await prisma.contato.findFirst({
    where: { id: body.contatoId, consultorId: req.consultorId },
  });

  if (!contato) {
    throw new NotFoundError('Contato não encontrado.');
  }

  const contrato = await prisma.contrato.create({
    data: {
      valor: body.valor,
      contatoId: contato.id,
      consultorId: req.consultorId!,
    },
    include: { contato: { select: { id: true, nome: true, telefone: true, profissao: true } } },
  });

  return res.status(201).json(serializeContrato(contrato));
}

export async function cancelarContrato(req: Request, res: Response) {
  const id = req.params.id as string;

  const contrato = await prisma.contrato.findFirst({
    where: { id, consultorId: req.consultorId },
  });

  if (!contrato) {
    throw new NotFoundError('Contrato não encontrado.');
  }

  await prisma.contrato.delete({ where: { id: contrato.id } });

  return res.status(204).send();
}