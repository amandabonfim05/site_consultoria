-- =====================================================================
-- Site Consultoria — bootstrap do banco (PostgreSQL / RDS)
--
-- Este arquivo é o mesmo conteúdo de
-- prisma/migrations/20260101000000_init/migration.sql, disponibilizado
-- aqui como um único script para quem preferir aplicar via psql direto
-- (sem passar pelo Prisma CLI). Se você for usar `prisma migrate deploy`,
-- não precisa rodar este arquivo manualmente — o Prisma já aplica o
-- conteúdo de prisma/migrations/ sozinho.
-- =====================================================================

-- Rode este arquivo a partir da RAIZ deste pacote (site-consultoria-database/):
--   psql "$DATABASE_URL" -f sql/init.sql
\i prisma/migrations/20260101000000_init/migration.sql
