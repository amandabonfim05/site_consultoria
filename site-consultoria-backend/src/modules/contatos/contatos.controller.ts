import type { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { NotFoundError } from '../../utils/httpErrors';
import type { ContatoInput } from './contatos.schemas';

function parseDataNascimento(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function listContatos(req: Request, res: Response) {
  const contatos = await prisma.contato.findMany({
    where: { consultorId: req.consultorId },
    orderBy: { nome: 'asc' },
  });

  return res.json(contatos);
}

export async function getContato(req: Request, res: Response) {
  const id = req.params.id as string;

  const contato = await prisma.contato.findFirst({
    where: { id, consultorId: req.consultorId },
  });

  if (!contato) {
    throw new NotFoundError('Contato não encontrado.');
  }

  return res.json(contato);
}

export async function createContato(req: Request, res: Response) {
  const body = req.body as ContatoInput;

  const contato = await prisma.contato.create({
    data: {
      nome: body.nome,
      email: body.email ?? '',
      telefone: body.telefone ?? '',
      profissao: body.profissao || null,
      indicadoPor: body.indicadoPor || null,
      detalhes: body.detalhes || null,
      dataNascimento: parseDataNascimento(body.dataNascimento),
      consultorId: req.consultorId!,
    },
  });

  return res.status(201).json(contato);
}

export async function updateContato(req: Request, res: Response) {
  const id = req.params.id as string;
  const body = req.body as ContatoInput;

  const existing = await prisma.contato.findFirst({
    where: { id, consultorId: req.consultorId },
  });

  if (!existing) {
    throw new NotFoundError('Contato não encontrado.');
  }

  const contato = await prisma.contato.update({
    where: { id: existing.id },
    data: {
      nome: body.nome,
      email: body.email ?? '',
      telefone: body.telefone ?? '',
      profissao: body.profissao || null,
      indicadoPor: body.indicadoPor || null,
      detalhes: body.detalhes || null,
      dataNascimento: parseDataNascimento(body.dataNascimento),
    },
  });

  return res.json(contato);
}

export async function deleteContato(req: Request, res: Response) {
  const id = req.params.id as string;

  const existing = await prisma.contato.findFirst({
    where: { id, consultorId: req.consultorId },
  });

  if (!existing) {
    throw new NotFoundError('Contato não encontrado.');
  }

  await prisma.contato.delete({ where: { id: existing.id } });

  return res.status(204).send();
}