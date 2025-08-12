import type { ElysiaApp } from "../../index";
import { collection, query, getDocs, DocumentData, setDoc, doc } from "firebase/firestore";
import db from "../../lib/firebase";
import { generateRandomId } from '../../lib/randomid';
import { t } from "elysia";

const newResBodySchema = t.Object({
    title: t.String(),
    decs: t.String(),
    experience: t.Number()
});

const getInfoHandler = async () => {
    let Data: DocumentData[] = [];
    const q = query(collection(db, "feedback"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        let qd = doc.data();
        qd.id = doc.id;
        Data.push(qd);
    });

    return Data;
};

const newFeedBackHandler = async ({ body, set }: { body: typeof newResBodySchema.static, set: { status: number | string } }) => {
    const { title, decs, experience } = body;

    try {
        await setDoc(doc(db, "feedback", generateRandomId()), {
            title,
            decs,
            experience
        });

        set.status = 200;
        return "Done !";
    } catch (error) {
        console.error("Error adding document:", error);
        set.status = 500;
        return { error: "Error adding document" };
    }
};

export default (app: ElysiaApp) => app
    .get("/", getInfoHandler)
    .post("/", newFeedBackHandler, {
        body: newResBodySchema
    });