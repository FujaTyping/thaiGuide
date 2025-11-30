FROM oven/bun:latest

WORKDIR /app

COPY package.json ./

RUN bun install

COPY . .

EXPOSE 3033/tcp

CMD [ "bun","run","src/index.ts" ]