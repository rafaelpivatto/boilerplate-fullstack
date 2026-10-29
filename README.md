# Project Monorepo Boilerplate

Boilerplate genérico para novos projetos full-stack. Ele traz um exemplo pequeno de lista de tarefas para mostrar o caminho completo sem acoplar o template a um domínio específico.

## Stack

- pnpm workspaces + Turborepo
- API: NestJS, Clean Architecture, Prisma 7 e PostgreSQL
- Web: Next.js App Router, React, TanStack Query e Feature-Sliced Design
- Contratos: `packages/shared`
- UI: Tailwind v4, tokens semânticos, primitives locais e Lucide
- Testes: Vitest

## Começando

### Com Docker

Se você quiser subir banco, API e Web juntos:

```bash
docker compose up --build
```

Web: http://localhost:3000 · API: http://localhost:3001/api/v1/health

Para parar e remover os containers:

```bash
docker compose down
```

### Localmente

```bash
cp .env.example .env
pnpm install
docker compose up -d db
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Se você já tinha criado o volume do PostgreSQL antes do usuário de aplicação ser adicionado, recrie-o uma vez para executar o script de inicialização:

```bash
docker compose down -v
docker compose up --build
```

O volume removido contém apenas dados locais da demo. O script `docker/init.sql` cria o usuário não-superusuário usado pela aplicação; isso é importante para que o RLS seja efetivo.

Web: http://localhost:3000 · API: http://localhost:3001/api/v1/health

O exemplo usa o repositório Prisma por padrão. As tarefas do seed são persistidas no PostgreSQL e permanecem após reiniciar a API. A tela demonstra o CRUD completo: criar, editar título, alternar status e excluir.

Para testar a autenticação, entre em http://localhost:3000/login com `demo@example.com` e `password123`. O cookie de sessão é HTTP-only e as tarefas são isoladas por usuário via RLS.

## Como usar este modelo

1. Renomeie os pacotes `@project/*` e os imports do workspace.
2. Troque o exemplo `Task` por uma entidade do seu domínio.
3. Mantenha contratos reutilizados em `packages/shared`.
4. Preserve as fronteiras `domain → application → infrastructure → presentation`.
5. Na web, preserve a direção `app → page-compositions → widgets → features → entities → shared`.

## Testes de referência

```bash
pnpm test
```

Há exemplos de teste de entidade e casos de uso na API, além de um teste de contrato HTTP na Web. Os testes ficam ao lado do código relacionado e os artefatos `dist/`/`.next/` ficam excluídos da descoberta do Vitest.

O teste E2E exige PostgreSQL e valida o fluxo HTTP completo com dois usuários, incluindo isolamento RLS e rotação do refresh token:

```bash
pnpm --filter @project/api test:e2e
```

Veja `docs/architecture.md`, `docs/design-system.md` e `docs/decisions.md` antes de ampliar o projeto.

## Comandos principais

```bash
pnpm dev                              # Web e API em desenvolvimento
pnpm build                            # Build de todos os pacotes
pnpm lint                             # ESLint
pnpm type-check                       # TypeScript + Prisma Client
pnpm test                             # Testes unitários e de contrato
pnpm --filter @project/api test:e2e   # E2E com PostgreSQL e RLS
pnpm docker:up                        # Compose completo com build
pnpm docker:down                      # Para os containers
```

## Fluxo de autenticação

1. Acesse `/login` ou use `POST /api/v1/auth/register`.
2. A API emite `access_token`, `refresh_token` e `refresh_user_id` em cookies HTTP-only.
3. O Web renova automaticamente o access token quando recebe `401`.
4. O refresh token é rotacionado e o anterior é revogado.
5. `/auth/logout` revoga a sessão atual.

## Estrutura resumida

```text
apps/api/src/
├── domain/           # entidades, ports e interfaces de repositório
├── application/      # casos de uso
├── infrastructure/   # Prisma, auth, RLS e integrações
└── presentation/     # controllers, guards e filtros HTTP

apps/web/src/
├── app/               # rotas Next.js e providers globais
├── page-compositions/ # páginas completas
├── widgets/           # blocos compostos
├── features/          # ações e fluxos do usuário
├── entities/          # APIs e contratos por entidade
└── shared/            # UI, config e utilitários
```
