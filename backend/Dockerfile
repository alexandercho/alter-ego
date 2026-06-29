FROM node:26-alpine AS dependencies

WORKDIR /app

RUN npm install --global pnpm@10.12.1

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM dependencies AS build

COPY tsconfig.json ./
COPY src ./src
RUN pnpm build

FROM node:26-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

RUN npm install --global pnpm@10.12.1

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=build /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/server.js"]
