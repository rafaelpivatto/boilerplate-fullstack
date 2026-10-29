# Regras do boilerplate

- Preserve as fronteiras da Clean Architecture na API.
- `domain/` não importa NestJS, Prisma ou HTTP.
- `application/` depende apenas do domínio.
- `infrastructure/` implementa interfaces do domínio e não vaza tipos Prisma.
- Controllers delegam para casos de uso; regra de negócio não fica na camada HTTP.
- Na web, respeite `app → page-compositions → widgets → features → entities → shared`.
- Server state usa TanStack Query; Zustand é reservado para sessão/UI.
- Sessão usa cookies HTTP-only; nunca armazene tokens em `localStorage`.
- Tabelas protegidas por RLS usam contexto transacional com `SET LOCAL`; não faça queries sensíveis fora do repository contextualizado.
- Contratos compartilhados ficam em `packages/shared`.
- Use migrations versionadas; nunca `prisma db push`.
- Adicione testes ao lado do arquivo testado e valide com `pnpm lint`, `pnpm type-check` e `pnpm test`.
