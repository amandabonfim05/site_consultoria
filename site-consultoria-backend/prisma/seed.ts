import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await hashPassword('123456');

  const consultor = await prisma.consultor.upsert({
    where: { email: 'consultor@exemplo.com' },
    update: {},
    create: {
      nome: 'Consultor Exemplo',
      email: 'consultor@exemplo.com',
      senhaHash,
      metaMensal: 20000,
    },
  });

  const contato = await prisma.contato.upsert({
    where: { id: 'seed-contato-1' },
    update: {},
    create: {
      id: 'seed-contato-1',
      nome: 'Fulano de Tal',
      email: 'fulano@gmail.com',
      telefone: '(71) 9 9999-0000',
      profissao: 'Engenheiro',
      indicadoPor: 'Ciclano',
      consultorId: consultor.id,
    },
  });

  await prisma.contrato.create({
    data: { valor: 5000, consultorId: consultor.id, contatoId: contato.id },
  });

  await prisma.analise.create({
    data: { status: 'APROVADA', consultorId: consultor.id, contatoId: contato.id },
  });

  await prisma.ligacao.create({
    data: { consultorId: consultor.id },
  });

  console.log('Seed concluído. Login de teste: consultor@exemplo.com / 123456');
}

main()
  .catch((error) => {

    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
