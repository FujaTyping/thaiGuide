import { Elysia } from "elysia";
import { autoload } from "elysia-autoload";
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';

const app = new Elysia()
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
