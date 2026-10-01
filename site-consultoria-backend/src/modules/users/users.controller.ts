import type { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { NotFoundError } from '../../utils/httpErrors';
import type { UserProfileInput, UpdateMetaInput } from './users.schemas';

function toDateOrUndefined(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function serializeProfile(consultor: {
  nome: string;
  email: string;
  telefone: string | null;
  dataNascimento: Date | null;
}) {
  return {
    nome: consultor.nome,
    email: consultor.email,
    telefone: consultor.telefone ?? '',
    dataNascimento: consultor.dataNascimento
      ? consultor.dataNascimento.toISOString().slice(0, 10)
      : '',
  };
}

export async function getMe(req: Request, res: Response) {
  const consultor = await prisma.consultor.findUnique({ where: { id: req.consultorId } });

  if (!consultor) {
    throw new NotFoundError('Usuário não encontrado.');
  }

  return res.json(serializeProfile(consultor));
}

export async function updateMe(req: Request, res: Response) {
  const body = req.body as UserProfileInput;

  const consultor = await prisma.consultor.update({
    where: { id: req.consultorId },
    data: {
      nome: body.nome,
      email: body.email,
      telefone: body.telefone || null,
      dataNascimento: toDateOrUndefined(body.dataNascimento) ?? null,
    },
  });

  return res.json(serializeProfile(consultor));
}

export async function updateMeta(req: Request, res: Response) {
  const body = req.body as UpdateMetaInput;

  const consultor = await prisma.consultor.update({
    where: { id: req.consultorId },
    data: { metaMensal: body.metaMensal },
  });

  return res.json({ metaMensal: Number(consultor.metaMensal) });
}

