import type { ElysiaApp } from "../index";
import figlet from "figlet";
import {version,name} from "../../package.json"

async function gett() {
    const text = await figlet.text("Thaiguide",{
        font: "Shadow"
    });
    return text + `\n\n===== ${name} V.${version} (BETA) ===== `
}

export default (app: ElysiaApp) => app
    .get("/", gett);