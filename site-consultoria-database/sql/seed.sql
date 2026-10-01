-- Seed de dados de exemplo para o Site Consultoria.
-- Login de teste criado: consultor@exemplo.com / 123456
-- (o hash abaixo é um bcrypt real da senha "123456", gerado com bcryptjs
-- da mesma forma que o backend gera em produção)

INSERT INTO "consultores" ("id", "nome", "email", "senhaHash", "metaMensal", "updatedAt")
VALUES (
  'a0000000-0000-4000-8000-000000000001',
  'Consultor Exemplo',
  'consultor@exemplo.com',
  '$2b$10$Ar2DwJuIwQtl9Jf/Hsgg..5EqhQDG3eIA0v1bEp2qJw2PZrz6oGZK',
  20000,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "contatos" ("id", "nome", "email", "telefone", "profissao", "indicadoPor", "consultorId", "updatedAt")
VALUES (
  'b0000000-0000-4000-8000-000000000001',
  'Fulano de Tal',
  'fulano@gmail.com',
  '(71) 9 9999-0000',
  'Engenheiro',
  'Ciclano',
  'a0000000-0000-4000-8000-000000000001',
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "contratos" ("id", "valor", "consultorId", "contatoId")
VALUES (
  'c0000000-0000-4000-8000-000000000001',
  5000,
  'a0000000-0000-4000-8000-000000000001',
  'b0000000-0000-4000-8000-000000000001'
)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "analises" ("id", "status", "consultorId", "contatoId", "updatedAt")
VALUES (
  'd0000000-0000-4000-8000-000000000001',
  'APROVADA',
  'a0000000-0000-4000-8000-000000000001',
  'b0000000-0000-4000-8000-000000000001',
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ligacoes" ("id", "consultorId")
VALUES (
  'e0000000-0000-4000-8000-000000000001',
  'a0000000-0000-4000-8000-000000000001'
)
ON CONFLICT ("id") DO NOTHING;
