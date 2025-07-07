import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { t } from "elysia";

const GetByIdBodySchema = t.Object({
    country: t.String()
});

const getInfoHandler = async ({ body, set }: { body: typeof GetByIdBodySchema.static, set: { status: number | string } }) => {
    const { country } = body;
    const docRef = doc(db, "stream", "survey");

    try {
        const docSnap = await getDoc(docRef);
        const responseData = docSnap.data();

        if (responseData) {
            if (responseData[country] === undefined) {
                await updateDoc(docRef, {
                    [country]: 1,
                });
            } else {
                await updateDoc(docRef, {
                    [country]: responseData[country] + 1,
                });
            }
        }

        set.status = 200;
        return "Done!";
    } catch {
        set.status = 500;
        return { error: "An error occurred while fetching the document" };
    }
};

export default (app: ElysiaApp) => app
    .post("/survey", getInfoHandler, {
        body: GetByIdBodySchema
    });