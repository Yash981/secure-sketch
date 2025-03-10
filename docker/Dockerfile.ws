FROM node:20-alpine
RUN npm install -g pnpm
RUN pnpm --version
WORKDIR /user/src/app

COPY ./packages ./packages
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ./package.json ./package.json

COPY ./turbo.json ./turbo.json

COPY ./apps/ws ./apps/ws

RUN pnpm install

RUN npm run db:generate

EXPOSE 8080

CMD [ "pnpm","run","start:ws" ]

