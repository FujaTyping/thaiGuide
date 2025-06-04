import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";

const getInfoHandler = () => {
    const firebaseApp = db.app;
    const projectId = firebaseApp.options.projectId;
    if (!projectId) {
        return JSON.stringify({ error: "Project ID not configured" });
    }

    const databaseId = {
        projectId: projectId,
        database: "(default)",
    };
    return JSON.stringify(databaseId);
};

export default (app: ElysiaApp) => app.get("/info", getInfoHandler);