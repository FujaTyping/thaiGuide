import type { ElysiaApp } from "../../index";
import { collection, query as fbquery, getDocs, DocumentData, doc, getDoc, query, limit, Query } from "firebase/firestore";
import db from "../../lib/firebase";
import { t } from "elysia";

const GetSchema = {
    query: t.Object({
        limit: t.Optional(t.Number())
    })
}

const getInfoHandler = async ({ set, query }: { set: { status: number | string }, query: typeof GetSchema.query.static }) => {
    const roadtripsCollectionRef = collection(db, "roadtrip");
    let q: Query;

    if (query.limit) {
        q = fbquery(roadtripsCollectionRef, limit(query.limit));
    } else {
        q = fbquery(roadtripsCollectionRef);
    }

    const querySnapshot = await getDocs(q);

    const results = await Promise.all(
        querySnapshot.docs.map(async (docSnapshot) => {
            const docData = docSnapshot.data();
            const roadtripItem = { ...docData, id: docSnapshot.id };

            const tagsCollectionRef = collection(db, "roadtrip", docSnapshot.id, "tags");
            const tagsSnapshot = await getDocs(tagsCollectionRef);

            if (!tagsSnapshot.empty) {
                const tagIds = tagsSnapshot.docs.map(tagDoc => tagDoc.id);
                return {
                    ...roadtripItem,
                    tags: tagIds
                };
            } else {
                return roadtripItem;
            }
        })
    );

    set.status = 200;
    return results;
};

const getIdInfoHandler = async ({ params: { id }, set }: { params: { id: string }, set: { status: number | string } }) => {
    const docId = id;
    const docRef = doc(db, "roadtrip", docId);

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const docData = docSnap.data();
            const roadtripItem: { id: string; tags?: string[]; stops?: { [key: string]: DocumentData };[key: string]: any } = {
                ...docData,
                id: docId
            };

            const tagsCollectionRef = collection(db, "roadtrip", docId, "tags");
            const tagsSnapshot = await getDocs(tagsCollectionRef);

            if (!tagsSnapshot.empty) {
                const tagIds = tagsSnapshot.docs.map(tagDoc => tagDoc.id);
                roadtripItem.tags = tagIds;
            }

            const stopsCollectionRef = collection(db, "roadtrip", docId, "stops");
            const stopsSnapshot = await getDocs(stopsCollectionRef);

            if (!stopsSnapshot.empty) {
                const stopsData = stopsSnapshot.docs.reduce((acc, stopDoc) => {
                    acc[stopDoc.id] = stopDoc.data();
                    return acc;
                }, {} as { [key: string]: DocumentData });
                roadtripItem.stops = stopsData;
            }

            set.status = 200;
            return roadtripItem;

        } else {
            set.status = 404;
            return { message: "No data found" };
        }
    } catch (error) {
        console.error(`Error fetching roadtrip with ID ${docId}:`, error);
        set.status = 500;
        return { error: "An error occurred while fetching the document." };
    }
};

export default (app: ElysiaApp) => app
    .get("/", getInfoHandler, GetSchema)
    .get("/getbyid/:id", getIdInfoHandler);