import type { ElysiaApp } from "../index";

function gett() {
    return "Please visit /document for the api documentation"
}

export default (app: ElysiaApp) => app
    .get("/", gett);