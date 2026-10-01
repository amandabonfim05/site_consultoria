import type { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export async function createLigacao(req: Request, res: Response) {
  const ligacao = await prisma.ligacao.create({
    data: { consultorId: req.consultorId! },
  });

  return res.status(201).json(ligacao);
}
