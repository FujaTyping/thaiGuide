import type { ElysiaApp } from "../../index";
import { collection, query, getDocs, DocumentData, doc, getDoc } from "firebase/firestore";
import db from "../../lib/firebase";
import { t } from "elysia";

const GetByIdBodySchema = t.Object({
    id: t.String()
});

const getInfoHandler = async () => {
    let Data: DocumentData[] = [];
    const q = query(collection(db, "activities"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        let qd = doc.data();
        qd.id = doc.id;
        Data.push(qd);
    });

    return Data;
};

const getIdInfoHandler = async ({ body, set }: { body: typeof GetByIdBodySchema.static, set: { status: number | string } }) => {
    const docId = body.id;
    const docRef = doc(db, "activities", docId);

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();

            const dRef = collection(db, "activities", docId, "details")
            const dSnapshot = await getDocs(dRef)

            if (!dSnapshot.empty) {
                const details = dSnapshot.docs.reduce((acc: any, doc) => {
                    acc[doc.id] = doc.data().value;
                    return acc;
                }, {});

                set.status = 200;
                return {
                    ...userData,
                    details
                };
            }

            set.status = 200;
            return userData;
        } else {
            set.status = 404;
            return { message: "No data found" };
        }
    } catch (error) {
        set.status = 500;
        return { error: "An error occurred while fetching the document." };
    }
};

export default (app: ElysiaApp) => app
    .get("/", getInfoHandler)
    .put("/getbyid", getIdInfoHandler, {
        body: GetByIdBodySchema
    });