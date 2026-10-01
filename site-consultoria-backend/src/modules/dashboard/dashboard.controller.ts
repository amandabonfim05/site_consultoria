import type { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

function monthsRange(months: number): { start: Date; end: Date }[] {
  const now = new Date();
  const ranges: { start: Date; end: Date }[] = [];

  for (let i = months - 1; i >= 0; i -= 1) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    ranges.push({ start, end });
  }

  return ranges;
}

export async function getMetrics(req: Request, res: Response) {
  const consultorId = req.consultorId!;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [
    consultor,
    quantidadeContatos,
    quantidadeContratos,
    analises,
    aprovadas,
    contratosDoMes,
    contratosDoAno,
  ] = await Promise.all([
    prisma.consultor.findUnique({ where: { id: consultorId } }),
    prisma.contato.count({ where: { consultorId } }),
    prisma.contrato.count({ where: { consultorId } }),
    prisma.analise.count({ where: { consultorId } }),
    prisma.analise.count({ where: { consultorId, status: 'APROVADA' } }),
    prisma.contrato.aggregate({
      where: { consultorId, fechadoEm: { gte: startOfMonth } },
      _sum: { valor: true },
    }),
    prisma.contrato.aggregate({
      where: { consultorId, fechadoEm: { gte: startOfYear } },
      _sum: { valor: true },
    }),
  ]);

  const meses = monthsRange(6);

  const [analisesPorMes, ligacoesPorMes] = await Promise.all([
    Promise.all(
      meses.map(({ start, end }) =>
        prisma.analise.count({
          where: { consultorId, createdAt: { gte: start, lt: end } },
        })
      )
    ),
    Promise.all(
      meses.map(({ start, end }) =>
        prisma.ligacao.count({
          where: { consultorId, realizadaEm: { gte: start, lt: end } },
        })
      )
    ),
  ]);

  const totalMes = Number(contratosDoMes._sum.valor ?? 0);
  const jaGanhoNoAno = Number(contratosDoAno._sum.valor ?? 0);

  const mesAtual = now.getMonth() + 1;
  const mesesRestantes = 12 - mesAtual;
  const totalAno = jaGanhoNoAno + totalMes * mesesRestantes;

  return res.json({
    analises,
    aprovadas,
    totalMes,
    totalAno,
    meta: Number(consultor?.metaMensal ?? 0),
    real: totalMes,
    quantidadeContatos,
    quantidadeContratos,
    analisesPorMes,
    ligacoesPorMes,
  });
}