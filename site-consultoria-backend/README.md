# Site Consultoria — Backend

API do Site Consultoria, na arquitetura:

```
React (front) → API Gateway → AWS Lambda (Node + Express + TypeScript) → Prisma → PostgreSQL (RDS)
```

## Stack

- **Node.js + Express + TypeScript**
- **Prisma** como ORM (PostgreSQL)
- **serverless-http** para empacotar o Express como handler de Lambda
- **jsonwebtoken** + **bcryptjs** para autenticação
- **zod** para validação de payloads
- **helmet** + **cors** para segurança básica

O mesmo código do Express roda tanto localmente (`npm run dev`, com Express "puro" escutando numa porta) quanto na Lambda (`src/lambda.ts`, via `serverless-http`) — não há duplicação de lógica entre os dois ambientes.

## Estrutura

```
src/
  app.ts              # monta o Express: middlewares globais + rotas
  server.ts            # entrypoint local (dev)
  lambda.ts             # handler da Lambda (usado em produção)
  lib/
    env.ts               # validação das env vars (zod)
    prisma.ts             # instância singleton do Prisma Client
  middlewares/
    auth.middleware.ts    # valida o JWT do header Authorization
    validate.middleware.ts# valida req.body com um schema zod
    error.middleware.ts   # tratamento central de erros
  modules/
    auth/                 # POST /auth/login, POST /auth/signup
    contatos/              # CRUD de /contatos (escopado por consultor)
    users/                  # GET/PUT /users/me
    dashboard/               # GET /dashboard/metrics
  utils/
    jwt.ts, password.ts, asyncHandler.ts, httpErrors.ts
prisma/
  schema.prisma          # modelos: Consultor, Contato, Contrato, Analise, Ligacao
  seed.ts                 # popula um consultor + dados de exemplo
```

## Rodando localmente

Pré-requisitos: Node 20+, um PostgreSQL acessível (local, Docker ou RDS).

> **Importante:** o projeto usa **Prisma 6** (fixado no `package.json`), não a versão
> 7 mais recente — a 7 mudou a forma como `DATABASE_URL` é lida e quebra o
> `schema.prisma` deste projeto. Não rode `npm install prisma@latest`.

```bash
npm install
cp .env.example .env        # ajuste DATABASE_URL e JWT_SECRET
npx prisma generate
npx prisma migrate dev --name init
npm run seed                 # cria consultor@exemplo.com / 123456 com dados de exemplo
npm run dev                   # sobe em http://localhost:3333
```

> **Nota:** `npx prisma generate` precisa baixar o engine do Prisma pela internet
> (`binaries.prisma.sh`). Se você estiver atrás de um proxy/firewall corporativo,
> libere esse domínio (ou rode isso numa máquina/CI com acesso irrestrito).

## Endpoints

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/auth/login` | não | `{ email, password }` → `{ token, consultor }` |
| POST | `/auth/signup` | não | `{ nome, email, senha }` → `{ token, consultor }` |
| GET | `/contatos` | sim | lista os contatos do consultor logado |
| GET | `/contatos/:id` | sim | detalhe de um contato |
| POST | `/contatos` | sim | cria um contato |
| PUT | `/contatos/:id` | sim | edita um contato |
| DELETE | `/contatos/:id` | sim | remove um contato |
| GET | `/users/me` | sim | perfil do consultor logado |
| PUT | `/users/me` | sim | atualiza o perfil |
| GET | `/dashboard/metrics` | sim | métricas agregadas do dashboard |

Rotas autenticadas exigem o header `Authorization: Bearer <token>` (token retornado no login/signup).

## Deploy (AWS Lambda + API Gateway)

O projeto já vem com um `serverless.yml` pronto (Serverless Framework), configurado para:
- publicar a Lambda com o handler `dist/lambda.handler`
- expor tudo atrás de um HTTP API Gateway (`ANY /{proxy+}`)
- rodar dentro da VPC do RDS (necessário para a Lambda alcançar o banco)

Passos:

```bash
npm install -g serverless   # CLI, instalada globalmente na sua máquina/CI
npm run build                # compila TypeScript para dist/
# defina as env vars: DATABASE_URL, JWT_SECRET, LAMBDA_SECURITY_GROUP_ID,
# LAMBDA_SUBNET_ID_A, LAMBDA_SUBNET_ID_B (sub-redes privadas com acesso ao RDS)
npx serverless deploy --stage prod
```

Alternativas equivalentes: AWS SAM ou CDK, se preferir não usar o Serverless Framework —
a Lambda (`dist/lambda.handler`) e a integração com o Express são as mesmas em qualquer uma delas.

### Rodando as migrations do Prisma contra o RDS

Como a Lambda fica numa VPC privada, rode as migrations de um lugar com acesso ao RDS
(um bastion host, uma pipeline de CI dentro da VPC, ou um túnel SSH):

```bash
DATABASE_URL="postgresql://...rds..." npx prisma migrate deploy
```

## Integração com o front-end

O front (`site-consultoria-frontend`) já está com `services/` apontando para esses
mesmos endpoints e nomes de campos (inclusive a inconsistência pt-BR/inglês entre
`senha` no cadastro e `password` no login, que foi mantida de propósito para bater
com o que o front já envia).
