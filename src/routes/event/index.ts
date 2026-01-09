import type { ElysiaApp } from "../../index";
import { collection, getDocs, DocumentData, doc, getDoc } from "firebase/firestore";
import db from "../../lib/firebase";
import { t } from "elysia";
import getWithRedis from "../../lib/getWithRedis";

const GetSchema = {
    query: t.Object({
        limit: t.Optional(t.Number())
    })
}

const getInfoHandler = async ({ query, set }: { query: typeof GetSchema.query.static, set: { status: number } }) => {
    const data = getWithRedis({ name: "event", limits: query.limit });
    set.status = 200;

    return data;
};

const getIdInfoHandler = async ({ params: { id }, set }: { params: { id: string }, set: { status: number | string } }) => {
    const docId = id;
    const docRef = doc(db, "event", docId);

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            const responseData: DocumentData = { ...userData };

            const detailsCollectionRef = collection(db, "event", docId, "details");
            const detailsSnapshot = await getDocs(detailsCollectionRef);

            if (!detailsSnapshot.empty) {
                const details = detailsSnapshot.docs.reduce((acc: Record<string, any>, detailDoc) => {
                    acc[detailDoc.id] = detailDoc.data();
                    return acc;
                }, {});
                responseData.details = details;
            }

            set.status = 200;
            return responseData;

        } else {
            set.status = 404;
            return { message: "No data found" };
        }
    } catch (error) {
        console.error("Error fetching document by ID:", error);
        set.status = 500;
        return { error: "An error occurred while fetching the document." };
    }
};

export default (app: ElysiaApp) => app
    .get("/", getInfoHandler, GetSchema)
    .get("/getbyid/:id", getIdInfoHandler);