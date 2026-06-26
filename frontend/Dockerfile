FROM node:26-alpine AS web-build

WORKDIR /app

ARG EXPO_PUBLIC_API_BASE_URL=http://localhost:3001
ARG EXPO_PUBLIC_MIN_SUPPORTED_API_VERSION=v1

ENV EXPO_PUBLIC_API_BASE_URL=${EXPO_PUBLIC_API_BASE_URL}
ENV EXPO_PUBLIC_MIN_SUPPORTED_API_VERSION=${EXPO_PUBLIC_MIN_SUPPORTED_API_VERSION}

RUN corepack enable && corepack prepare pnpm@10.12.1 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY app.json babel.config.mjs eslint.config.mjs tsconfig.json ./
COPY app ./app
COPY assets ./assets
COPY components ./components
COPY constants ./constants
COPY env.d.ts ./
COPY lib ./lib
COPY screens ./screens

# Build only the static Expo web app; native iOS/Android artifacts are not produced in this image.
RUN pnpm exec expo export --platform web --output-dir dist

FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=web-build /app/dist /usr/share/nginx/html

EXPOSE 80
