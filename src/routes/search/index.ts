import { getDocs, collection, query as firestoreQuery, orderBy, startAt, endAt } from "firebase/firestore";
import type { ElysiaApp } from "../../index";
import { t } from "elysia";
import db from "../../lib/firebase";

enum typeofSearch {
    ALL = 'all',
    PLACE = 'activities',
    FOOD = 'restaurant'
}

const searchSchema = {
    body: t.Object({
        query: t.String(),
        type: t.Enum(typeofSearch)
    })
}

async function searhByQuery({ body, set }: { body: typeof searchSchema.body.static, set: { status: number } }) {
    const { query, type } = body;

    try {
        if (type == typeofSearch.ALL) {
            let allSearch: any = {};
            const searchPromises = (['activities', 'restaurant']).map(async (typess) => {
                const collectionRef = collection(db, typess);
                const q = firestoreQuery(collectionRef,
                    orderBy('title'),
                    startAt(query),
                    endAt(query + "\uf8ff")
                );
                const querySnapshot = await getDocs(q);
                const fillterData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                allSearch[typess] = fillterData;
            });

            await Promise.all(searchPromises);

            set.status = 200;
            return allSearch;
        } else {
            const collectionRef = collection(db, type);
            const q = firestoreQuery(collectionRef,
                orderBy(type == 'activities' ? 'title' : 'name'),
                startAt(query),
                endAt(query + "\uf8ff")
            );

            const querySnapshot = await getDocs(q);
            const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            set.status = 200;
            return results;
        }
    } catch {
        set.status = 400;
        return "Error: while search your query";
    }
}

export default (app: ElysiaApp) => app
    .post("/", searhByQuery, searchSchema);