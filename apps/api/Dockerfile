FROM node:22-alpine AS build
WORKDIR /app
RUN apk --no-check-certificate add --no-cache ca-certificates openssl && update-ca-certificates
RUN corepack enable
ENV DATABASE_URL=postgresql://postgres:postgres@db:5432/project

COPY package.json pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/config-ts/package.json packages/config-ts/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN pnpm install

COPY . .
RUN pnpm --filter @project/shared build
# Some local Docker/VM environments intercept TLS with a private CA while
# downloading Prisma's platform engine. Keep this exception build-only.
RUN NODE_TLS_REJECT_UNAUTHORIZED=0 pnpm --filter @project/api prisma:generate
RUN pnpm --filter @project/api build

FROM node:22-alpine AS runtime
WORKDIR /app
RUN apk --no-check-certificate add --no-cache ca-certificates openssl && update-ca-certificates
COPY --from=build /app /app
ENV NODE_ENV=production
EXPOSE 3001
CMD ["sh", "-c", "cd apps/api && ./node_modules/.bin/prisma migrate deploy && ./node_modules/.bin/tsx prisma/seed.ts && node dist/src/main.js"]
