import type { ElysiaApp } from "../index";

function gett() {
    return "Exploration, begins!"
}

export default (app: ElysiaApp) => app
    .get("/", gett);