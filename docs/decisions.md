# Decisões técnicas

## Contratos no workspace

DTOs e enums usados pela API e pela web vivem em `packages/shared`, evitando duplicação e divergência.

## Prisma por migrations

O schema evolui com `prisma migrate`; `prisma db push` não faz parte do fluxo do projeto.

## Autorização centralizada

Quando o domínio ganhar usuários e recursos compartilhados, as regras de membership devem ficar em um `AuthorizationService`, não duplicadas em controllers.

## Sessão

Para autenticação, prefira cookies HTTP-only e refresh token persistido apenas como hash. Não use `localStorage` para tokens.

## RLS por usuário

O primeiro exemplo multiusuário usa ownership direto: `Task.ownerId` referencia `User.id`. A tabela `Task` usa `ENABLE ROW LEVEL SECURITY` e `FORCE ROW LEVEL SECURITY`; policies comparam `ownerId` a `app.user_id`. O contexto é aplicado com `SET LOCAL` dentro de uma transação, evitando vazamento entre conexões pooled.

As tabelas de autenticação ficam fora do RLS para manter o bootstrap de login simples. Quando o produto precisar de colaboração, o próximo passo é introduzir `Workspace`/`Member`, sem transformar o primeiro exemplo em um sistema multi-tenant completo.

## Refresh tokens

O access token tem vida curta e é emitido em cookie HTTP-only. O refresh token é opaco, aleatório e armazenado apenas como hash em `RefreshToken`; cada refresh revoga o token anterior e emite outro. O cookie `refresh_user_id` existe apenas para localizar as sessões daquele usuário e também é HTTP-only.

## Erros e configuração

Variáveis de ambiente são carregadas por `dotenv`/`ConfigModule` e validadas no bootstrap em produção. Um filtro HTTP global converte erros conhecidos do Prisma em respostas previsíveis, como `404` para registro inexistente e `409` para conflito de unicidade. O filtro não expõe detalhes internos em erros `500`.

## Testes E2E separados

`pnpm test` executa testes rápidos e determinísticos. Testes E2E ficam em `*.e2e.spec.ts` e exigem PostgreSQL real; são executados explicitamente por `pnpm --filter @project/api test:e2e` para não tornar o ciclo local padrão dependente de Docker.
