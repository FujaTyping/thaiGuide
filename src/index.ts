import { Elysia } from "elysia";
import { autoload } from "elysia-autoload";
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { rateLimit } from 'elysia-rate-limit';
import { cacheControl } from "elysiajs-cdn-cache";

const app = new Elysia()
  .use(cors({
    origin: "localhost:3000"  }))
  .use(cacheControl())
  .use(rateLimit({
    max: 10,
    duration: 2000
  }))
  .use(swagger({
    path: "/document"
  }))
  .use(await autoload())
  .listen(3033);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type ElysiaApp = typeof app;
