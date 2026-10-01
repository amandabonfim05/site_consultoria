import type { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { hashPassword, comparePassword } from '../../utils/password';
import { signToken } from '../../utils/jwt';
import { ConflictError, UnauthorizedError } from '../../utils/httpErrors';
import type { LoginInput, SignUpInput } from './auth.schemas';

function toPublicConsultor(consultor: { id: string; nome: string; email: string }) {
  return { id: consultor.id, nome: consultor.nome, email: consultor.email };
}

export async function signUp(req: Request, res: Response) {
  const { nome, email, senha } = req.body as SignUpInput;

  const existing = await prisma.consultor.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictError('Já existe uma conta com este e-mail.');
  }

  const senhaHash = await hashPassword(senha);

  const consultor = await prisma.consultor.create({
    data: { nome, email, senhaHash },
  });

  const token = signToken({ sub: consultor.id });

  return res.status(201).json({ token, consultor: toPublicConsultor(consultor) });
}

export async function login(req: Request, res: Response) {

  const { email, password } = req.body as LoginInput;

  const consultor = await prisma.consultor.findUnique({ where: { email } });
  if (!consultor) {
    throw new UnauthorizedError('E-mail ou senha inválidos.');
  }

  const senhaOk = await comparePassword(password, consultor.senhaHash);
  if (!senhaOk) {
    throw new UnauthorizedError('E-mail ou senha inválidos.');
  }

  const token = signToken({ sub: consultor.id });

  return res.status(200).json({ token, consultor: toPublicConsultor(consultor) });
}
