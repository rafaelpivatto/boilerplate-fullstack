# Arquitetura

## Visão geral

```text
Browser → Next.js (web) → /backend/v1 → NestJS (api) → PostgreSQL
                         ↘ @project/shared
```

## API: Clean Architecture

```text
domain          entidades, value objects, erros e interfaces
application     casos de uso e serviços de aplicação
infrastructure  Prisma, integrações e implementações das interfaces
presentation    controllers, guards, filtros e serialização HTTP
```

As dependências apontam para dentro. `domain` não conhece NestJS ou Prisma; `application` não importa infraestrutura; controllers apenas delegam para casos de uso.

O exemplo usa um `AppModule` flat. Repositórios são ligados por tokens definidos no domínio, mantendo a implementação Prisma substituível.

### Persistência

`PrismaService` é o client base. Repositories não expõem tipos Prisma para o domínio. Operações protegidas resolvem o client transacional através de `RlsDbContextStore`; operações globais de auth usam o client base.

### Auth e RLS

O exemplo usa JWT em cookie HTTP-only para autenticação. Tarefas possuem `ownerId` e são protegidas por PostgreSQL Row-Level Security. Operações de tarefa abrem um contexto transacional com `SET LOCAL app.user_id`; o repository resolve o client transacional via `AsyncLocalStorage`. RLS é uma defesa adicional: autorização semântica deve continuar na aplicação.

O Docker cria `app_user`, um usuário PostgreSQL não-superusuário. Usar `postgres` na aplicação faria o PostgreSQL ignorar RLS, mesmo com `FORCE ROW LEVEL SECURITY`.

## Web: Feature-Sliced Design

Importações só descem na hierarquia:

```text
app → page-compositions → widgets → features → entities → shared
```

TanStack Query é usado para server state. Zustand fica reservado para sessão e UI local.

## Fluxo de dados

```text
Login → cookie HTTP-only → JwtAuthGuard
                              ↓
Task controller → use case → RlsExecutor
                              ↓
                   SET LOCAL app.user_id
                              ↓
                    Prisma transaction → RLS policy
```

O controller não implementa ownership. Ele extrai o usuário autenticado; o caso de uso abre o contexto RLS e o repository executa a operação no client transacional.
