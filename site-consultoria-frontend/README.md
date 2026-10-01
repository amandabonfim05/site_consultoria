# Site Consultoria — Front-end

Front-end da plataforma de consultoria financeira, gerado a partir do design no Figma
(arquivo "Site-Consultoria").

## Stack

- **React 19 + TypeScript + Vite**
- **react-router-dom** para as rotas
- **axios** para consumir a API (API Gateway → AWS Lambda / Node + Express + TypeScript → Prisma → PostgreSQL/RDS)
- CSS Modules (sem Tailwind nem outras libs de UI, para manter o bundle leve)

## Estrutura

```
src/
  assets/                # imagens e ícones
  components/
    AuthLayout/           # layout compartilhado por Login e Sign Up
    AppLayout/             # layout compartilhado pelas telas autenticadas (sidebar de navegação)
    MiniBarChart/          # gráfico de barras leve, sem dependência externa
  pages/
    Login/                 # tela de login
    SignUp/                # tela de cadastro do consultor ("Sign")
    Dashboard/              # dashboard com métricas, gráficos e lista de contatos
    Contatos/
      ContatosList.tsx      # lista de contatos
      ContatoForm.tsx        # cadastro/edição de contato (mesma tela para os dois casos)
    Configuracoes/
      UserForm.tsx           # perfil do consultor logado
    Analise/                 # placeholder — wizard de 11 telas, entra em próxima entrega
  routes/
    ProtectedRoute.tsx       # bloqueia rotas que exigem login
  services/                  # api.ts, auth.ts, contacts.ts, user.ts, dashboard.ts
  types/                      # tipos TS de cada domínio
```

## Rodando localmente

```bash
npm install
cp .env.example .env   # e ajuste VITE_API_URL para o seu API Gateway
npm run dev
```

## Status das telas (arquivo Figma "Site-Consultoria")

| Tela | Status |
|---|---|
| Login | Implementada |
| Sign Up (cadastro do consultor) | Implementada |
| Contatos (lista + cadastro/edição) | Implementada |
| Dashboard | Implementada |
| Configurações (perfil do usuário) | Implementada |
| Analise financeira (wizard, 11 telas) | Placeholder — a implementar em etapas |

## Integração com o backend

Endpoints esperados no backend (Lambda/Express):

- `POST /auth/login` → `{ email, senha }` → `{ token, consultor }`
- `POST /auth/signup` → `{ nome, email, senha }` → `{ token, consultor }`
- `GET/POST/PUT/DELETE /contatos` (e `/contatos/:id`)
- `GET/PUT /users/me`
- `GET /dashboard/metrics`

Ajuste os arquivos em `src/services/` caso o contrato real da API seja diferente.

## Observação sobre a logo

A logo em `src/assets/logo.svg` é um placeholder simples. Os assets originais exportados
do Figma expiram em 7 dias (links temporários), então baixe a logo definitiva do Figma
e substitua o arquivo quando puder.
