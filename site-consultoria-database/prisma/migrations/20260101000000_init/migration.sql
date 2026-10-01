-- CreateEnum
CREATE TYPE "StatusAnalise" AS ENUM ('EM_ANDAMENTO', 'APROVADA', 'REPROVADA');

-- CreateTable
CREATE TABLE "consultores" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "telefone" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "metaMensal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contatos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3),
    "profissao" TEXT,
    "indicadoPor" TEXT,
    "detalhes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "consultorId" TEXT NOT NULL,

    CONSTRAINT "contatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contratos" (
    "id" TEXT NOT NULL,
    "valor" DECIMAL(12,2) NOT NULL,
    "fechadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consultorId" TEXT NOT NULL,
    "contatoId" TEXT NOT NULL,

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analises" (
    "id" TEXT NOT NULL,
    "status" "StatusAnalise" NOT NULL DEFAULT 'EM_ANDAMENTO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "consultorId" TEXT NOT NULL,
    "contatoId" TEXT NOT NULL,

    CONSTRAINT "analises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ligacoes" (
    "id" TEXT NOT NULL,
    "realizadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consultorId" TEXT NOT NULL,

    CONSTRAINT "ligacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "consultores_email_key" ON "consultores"("email");

-- CreateIndex
CREATE INDEX "contatos_consultorId_idx" ON "contatos"("consultorId");

-- CreateIndex
CREATE INDEX "contratos_consultorId_fechadoEm_idx" ON "contratos"("consultorId", "fechadoEm");

-- CreateIndex
CREATE INDEX "analises_consultorId_createdAt_idx" ON "analises"("consultorId", "createdAt");

-- CreateIndex
CREATE INDEX "ligacoes_consultorId_realizadaEm_idx" ON "ligacoes"("consultorId", "realizadaEm");

-- AddForeignKey
ALTER TABLE "contatos" ADD CONSTRAINT "contatos_consultorId_fkey" FOREIGN KEY ("consultorId") REFERENCES "consultores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_consultorId_fkey" FOREIGN KEY ("consultorId") REFERENCES "consultores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_contatoId_fkey" FOREIGN KEY ("contatoId") REFERENCES "contatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analises" ADD CONSTRAINT "analises_consultorId_fkey" FOREIGN KEY ("consultorId") REFERENCES "consultores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analises" ADD CONSTRAINT "analises_contatoId_fkey" FOREIGN KEY ("contatoId") REFERENCES "contatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ligacoes" ADD CONSTRAINT "ligacoes_consultorId_fkey" FOREIGN KEY ("consultorId") REFERENCES "consultores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
