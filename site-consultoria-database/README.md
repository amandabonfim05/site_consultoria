# Site Consultoria — Banco de Dados (PostgreSQL / RDS)

Este pacote cobre a última camada da arquitetura:

```
React → API Gateway → AWS Lambda (Node + Express) → Prisma → PostgreSQL (RDS)
```

Tudo aqui foi **testado de verdade**: subi um PostgreSQL 16 local, apliquei a
migration, rodei o seed e executei as mesmas queries que o backend faz (login,
listagem de contatos, agregações do dashboard) — incluindo um teste do
`ON DELETE CASCADE`. A infraestrutura Terraform passou por um parser HCL real
(não só revisão visual).

## Estrutura

```
prisma/
  schema.prisma                        # mesmo schema do backend — fonte da verdade
  migrations/
    migration_lock.toml
    20260101000000_init/migration.sql   # migration inicial (testada)
sql/
  init.sql                               # aplica a migration via psql puro (sem Prisma CLI)
  seed.sql                                # dados de exemplo — login: consultor@exemplo.com / 123456
infra/terraform/
  versions.tf                             # providers (aws, random)
  variables.tf                             # inputs (VPC, sub-redes, SG da Lambda, etc.)
  main.tf                                   # RDS + Security Group + Secrets Manager
  outputs.tf                                 # endpoint, ARN do secret, etc.
  terraform.tfvars.example                    # modelo para preencher com sua conta AWS
```

## 1. Provisionando o RDS (Terraform)

Pré-requisitos: uma VPC já existente com pelo menos 2 sub-redes **privadas** em
AZs diferentes, e o Security Group da Lambda do backend (o mesmo ID que vai no
`LAMBDA_SECURITY_GROUP_ID` do `serverless.yml`).

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars   # preencha vpc_id, sub-redes, SG da Lambda
terraform init
terraform plan
terraform apply
```

O que isso cria:
- **RDS PostgreSQL** (`db.t4g.micro`, 20GB `gp3`, single-AZ — dentro do free tier)
- **Security Group do banco**, liberando a porta 5432 **somente** para o Security
  Group da Lambda (nada de `0.0.0.0/0`)
- **DB Subnet Group** nas sub-redes privadas que você passar
- **Secret no Secrets Manager** já com usuário, senha (gerada aleatoriamente) e o
  `DATABASE_URL` pronto para colar na Lambda

Depois do `apply`, pegue a connection string:

```bash
terraform output db_credentials_secret_arn
aws secretsmanager get-secret-value --secret-id <arn-do-output> --query SecretString --output text | jq -r .database_url
```

> Ajuste `db_instance_class`, `db_allocated_storage` e `multi_az` no `.tfvars`
> se o projeto crescer além do free tier / do fluxo pequeno inicial.

## 2. Aplicando o schema

Duas formas, escolha uma:

**Opção A — via Prisma (recomendado, mesmo fluxo do backend):**
```bash
cd ../../site-consultoria-backend   # ou onde estiver o backend
# aponte DATABASE_URL para o endpoint do RDS (do secret acima)
npx prisma migrate deploy
```
O Prisma vai olhar para `prisma/migrations/` e aplicar o que estiver pendente —
copie a pasta `prisma/migrations/` deste pacote para dentro do backend (ela já
foi pensada pra ficar lá; o `schema.prisma` dos dois pacotes é o mesmo).

**Opção B — via psql puro (sem precisar do Prisma CLI):**
```bash
cd site-consultoria-database
psql "$DATABASE_URL" -f sql/init.sql
```

## 3. Populando com dados de exemplo (opcional)

```bash
psql "$DATABASE_URL" -f sql/seed.sql
```

Cria um consultor de teste: **consultor@exemplo.com / 123456**, com um contato,
um contrato, uma análise aprovada e uma ligação — o suficiente para o dashboard
não aparecer vazio.

## Modelo de dados

| Tabela | O que guarda |
|---|---|
| `consultores` | quem faz login (nome, email, senha com hash, meta mensal) |
| `contatos` | os contatos cadastrados por cada consultor |
| `contratos` | contratos fechados, ligados a um contato — alimenta as métricas de "Total do Mês/Ano" |
| `analises` | status de cada análise financeira (`EM_ANDAMENTO`, `APROVADA`, `REPROVADA`) — base da futura tela de Análise financeira |
| `ligacoes` | registro simples de ligações feitas, usado no gráfico do dashboard |

Todas as tabelas filho (`contatos`, `contratos`, `analises`, `ligacoes`) têm
`consultorId` com `ON DELETE CASCADE` — apagar um consultor limpa tudo o que é
dele automaticamente (testado).

## Backup e disponibilidade

- Backup automático diário, retenção configurável (`backup_retention_days`, padrão 3 dias)
- `deletion_protection = true` por padrão — protege contra exclusão acidental
  via `terraform destroy` ou console
- `multi_az = false` por padrão, para caber no free tier / fluxo pequeno; mude
  para `true` quando o projeto crescer e precisar de alta disponibilidade

## Rotação de credenciais

A senha do banco vive só no Secrets Manager (gerada pelo Terraform via
`random_password`, nunca commitada em texto puro). Se precisar trocar, gere uma
nova versão do secret e rode `terraform apply` de novo, ou troque direto no
RDS com `ALTER USER ... PASSWORD ...` e atualize o secret manualmente.
