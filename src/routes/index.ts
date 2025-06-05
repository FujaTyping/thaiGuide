import type { ElysiaApp } from "../index";

export default (app: ElysiaApp) => app.get("/", "Please visit /document for the api documentation");