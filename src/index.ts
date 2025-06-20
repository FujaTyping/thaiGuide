import { Elysia } from "elysia";
import { autoload } from "elysia-autoload";
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { rateLimit } from 'elysia-rate-limit'

const app = new Elysia()
  .use(rateLimit({
    max: 8,
    duration: 2000
  }))
  .use(cors())
  .use(swagger({
    path: "/document"
  }))
  .use(await autoload())
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type ElysiaApp = typeof app;
