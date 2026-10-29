FROM node:22-alpine AS build
WORKDIR /app
RUN apk --no-check-certificate add --no-cache ca-certificates openssl && update-ca-certificates
RUN corepack enable
ARG API_INTERNAL_URL=http://api:3001
ENV API_INTERNAL_URL=$API_INTERNAL_URL

COPY package.json pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/config-ts/package.json packages/config-ts/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN pnpm install

COPY . .
RUN pnpm --filter @project/shared build
RUN pnpm --filter @project/web build

FROM node:22-alpine AS runtime
WORKDIR /app
RUN apk --no-check-certificate add --no-cache ca-certificates openssl && update-ca-certificates
COPY --from=build /app /app
ENV NODE_ENV=production
EXPOSE 3000
CMD ["sh", "-c", "cd apps/web && ./node_modules/.bin/next start"]
