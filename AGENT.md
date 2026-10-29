# Guia para agentes

Este arquivo é o resumo operacional do boilerplate. Leia também `AGENTS.md`, que contém as regras curtas de arquitetura.

## Antes de editar

1. Leia `README.md` e os documentos em `docs/` relacionados à mudança.
2. Preserve as camadas da API: `domain → application → infrastructure → presentation`.
3. Preserve a direção de imports da Web: `app → page-compositions → widgets → features → entities → shared`.
4. Procure contratos existentes em `packages/shared` antes de criar tipos duplicados.

## Regras críticas

- `domain/` não importa NestJS, Prisma, HTTP ou detalhes de infraestrutura.
- Casos de uso não acessam Prisma diretamente.
- Controllers delegam; não coloque regra de negócio na camada HTTP.
- Server state usa TanStack Query; não replique dados da API em Zustand.
- Tokens ficam em cookies HTTP-only; nunca use `localStorage` para sessão.
- `Task` é protegida por RLS e deve ser acessada pelo repository contextualizado.
- Queries protegidas precisam rodar dentro de `RlsExecutor.withContext(...)`.
- Não use `prisma db push`; altere o schema com migration versionada.
- Não use o usuário PostgreSQL superusuário na aplicação; o Docker usa `app_user`.
- Não faça commit de `.env`, `node_modules`, `dist` ou `.next`.

## Ao adicionar uma entidade

1. Crie a entidade e as interfaces em `domain/`.
2. Crie o caso de uso em `application/`.
3. Crie o repository concreto em `infrastructure/`.
4. Adicione migration Prisma/SQL, incluindo RLS se os dados forem sensíveis.
5. Exponha o endpoint no controller.
6. Adicione API/tipos em `packages/shared` quando Web e API compartilharem o contrato.
7. Componha a UI seguindo FSD e exporte cada slice pelo `index.ts`.
8. Adicione teste ao lado do código e E2E se o fluxo envolver banco/autorização.

## Validação

```bash
pnpm install
pnpm lint
pnpm type-check
pnpm test
pnpm --filter @project/api test:e2e
docker compose up --build
```

Se a migration adicionar ou alterar RLS, teste pelo menos: usuário correto, usuário diferente, operação sem contexto e fluxo técnico/seed quando aplicável.
