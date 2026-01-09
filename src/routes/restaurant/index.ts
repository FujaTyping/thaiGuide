import type { ElysiaApp } from "../../index";
import { collection, query as fbquery, getDocs, DocumentData, doc, getDoc, limit, orderBy, Query } from "firebase/firestore";
import db from "../../lib/firebase";
import { t } from "elysia";
import getWithRedis from "../../lib/getWithRedis";

const GetSchema = {
    query: t.Object({
        limit: t.Optional(t.Number())
    })
}

const getInfoHandler = async ({ query, set }: { query: typeof GetSchema.query.static, set: { status: number } }) => {
    const data = getWithRedis({ name: "restaurant", limits: query.limit });
    set.status = 200;

    return data;
};

const getIdInfoHandler = async ({ params: { id }, set }: { params: { id: string }, set: { status: number | string } }) => {
    const docId = id;
    const docRef = doc(db, "restaurant", docId);

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            const responseData: DocumentData = { ...userData };

            const detailsCollectionRef = collection(db, "restaurant", docId, "details");
            const detailsSnapshot = await getDocs(detailsCollectionRef);

            if (!detailsSnapshot.empty) {
                const details = detailsSnapshot.docs.reduce((acc: Record<string, any>, detailDoc) => {
                    acc[detailDoc.id] = detailDoc.data().value;
                    return acc;
                }, {});
                responseData.details = details;
            }

            const dishCollectionRef = collection(db, "restaurant", docId, "dish");
            const dishSnapshot = await getDocs(dishCollectionRef);

            if (!dishSnapshot.empty) {
                const dishIds = dishSnapshot.docs.map(dishDoc => dishDoc.id);
                responseData.dish = dishIds;
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