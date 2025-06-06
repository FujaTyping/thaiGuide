import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { t } from "elysia";

const GetByIdBodySchema = t.Object({
    id: t.String()
});

const getInfoHandler = async ({ body, set }: { body: typeof GetByIdBodySchema.static, set: { status: number | string } }) => {
    const docId = body.id;
    const docRef = doc(db, "codes", docId);

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            set.status = 200;
            return docSnap.data();
        } else {
            set.status = 404;
            return { message: "No code found" };
        }
    } catch (error) {
        set.status = 500;
        return { error: "An error occurred while fetching the document." };
    }
};

export default (app: ElysiaApp) => app.put("/getbyid", getInfoHandler, {
    body: GetByIdBodySchema
});