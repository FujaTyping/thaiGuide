import { Elysia } from "elysia";
import { autoload } from "elysia-autoload";
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { rateLimit } from 'elysia-rate-limit';
import { cacheControl } from "elysiajs-cdn-cache";
import { bearer } from '@elysiajs/bearer';
import { CronJob } from 'cron';
import eventCycle from "./cron/event";
import bannerCycle from "./cron/banner";

const app = new Elysia()
  .use(cors({
    origin: /.*\.thaiguide\.in\.th$/
  }))
  .use(cacheControl())
  .use(rateLimit({
    max: 10,
    duration: 2000
  }))
  .use(bearer())
  .use(swagger({
    path: "/document"
  }))
  .use(await autoload())
  .listen(3033);

console.log(
  `[LOG] Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

const jobEvent = new CronJob(
  '0 12 * * *',
  eventCycle,
  null,
  true,
  'Asia/Bangkok'
);
console.log(`[CRON] Event cleanner is running`)

const jobBanner = new CronJob(
  '0 8 * * *',
  bannerCycle,
  null,
  true,
  'Asia/Bangkok'
);
console.log(`[CRON] Banner cleanner is running`)

export type ElysiaApp = typeof app;
