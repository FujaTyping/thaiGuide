import { t } from "elysia";
import type { ElysiaApp } from "../../../index";
import db from "../../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

const newSchema = {
    body: t.Object({
        message: t.String(),
        reference: t.String(),
        type: t.String()
    })
}

async function updateAL({ body, set }: { body: typeof newSchema.body.static, set: { status: number } }) {
    try {
        await setDoc(doc(db, "stream", "aleart"),
            {
                ...body
            }
        );

        set.status = 200;
        return 'Done';
    } catch (e: any) {
        set.status = 400;
        return e.message;
    }
}

export default (app: ElysiaApp) => app
    .patch("/update", updateAL, newSchema);