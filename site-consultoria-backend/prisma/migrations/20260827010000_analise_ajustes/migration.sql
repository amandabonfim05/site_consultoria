-- DropForeignKey
ALTER TABLE "analises" DROP CONSTRAINT "analises_contatoId_fkey";

-- AlterTable
ALTER TABLE "analises" ALTER COLUMN "contatoId" DROP NOT NULL;
ALTER TABLE "analises" ADD COLUMN "valorEstimado" DECIMAL(12,2);

-- AddForeignKey
ALTER TABLE "analises" ADD CONSTRAINT "analises_contatoId_fkey" FOREIGN KEY ("contatoId") REFERENCES "contatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
