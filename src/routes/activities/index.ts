import type { ElysiaApp } from "../../index";
import { collection, query as fbquery, getDocs, DocumentData, doc, getDoc, where, orderBy, limit, Query, query } from "firebase/firestore";
import db from "../../lib/firebase";
import { t } from "elysia";

const GetSchema = {
    query: t.Object({
        limit: t.Optional(t.Number())
    })
}

const getInfoHandler = async ({ query, set }: { query: typeof GetSchema.query.static, set: { status: number } }) => {
    let Data: DocumentData[] = [];
    let q: Query;

    if (query.limit) {
        q = fbquery(collection(db, "activities"), limit(query.limit));
    } else {
        q = fbquery(collection(db, "activities"));
    }

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        let qd = doc.data();
        qd.id = doc.id;
        Data.push(qd);
    });

    return Data;
};

const getIdInfoHandler = async ({ params: { id }, set }: { params: { id: string }, set: { status: number | string } }) => {
    const docId = id;
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

                if (userData.haveticket) {
                    let ticket: any = [];
                    const tickRef = collection(db, "activities", docId, "ticket")
                    const tickSnapshot = await getDocs(query(tickRef, orderBy("price", "asc")))

                    tickSnapshot.forEach((doc) => {
                        ticket.push(doc.data());
                    });

                    set.status = 200;
                    return {
                        ...userData,
                        details,
                        ticket
                    };
                }

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
        return { error: "An error occurred while fetching the document.", message: error.message };
    }
};

const getProvinceInfoHandler = async ({ params: { province }, set }: { params: { province: string }, set: { status: number | string } }) => {
    const targetProvince = province;

    try {
        const activitiesCollectionRef = collection(db, "activities");
        const q = query(activitiesCollectionRef, where("province", "==", targetProvince));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            set.status = 404;
            return { message: "No data found for the specified province" };
        }

        const results: DocumentData[] = [];

        for (const docSnap of querySnapshot.docs) {
            const activityData = docSnap.data();
            const activityId = docSnap.id;

            const dRef = collection(db, "activities", activityId, "details");
            const dSnapshot = await getDocs(dRef);
            let details = {};

            if (!dSnapshot.empty) {
                details = dSnapshot.docs.reduce((acc: any, detailDoc) => {
                    acc[detailDoc.id] = detailDoc.data().value;
                    return acc;
                }, {});
            }

            results.push({
                id: activityId,
                ...activityData,
                details
            });
        }

        set.status = 200;
        return results;

    } catch (error) {
        console.error("Error fetching activities by province:", error);
        set.status = 500;
        return { error: "An error occurred while fetching activities by province." };
    }
};

const getRandomActProvinceInfoHandler = async ({ params: { province }, set }: { params: { province: string }, set: { status: number | string } }) => {
    try {
        const activitiesCollectionRef = collection(db, "activities");
        const q = query(activitiesCollectionRef, where("province", "==", province));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            set.status = 404;
            return { message: "No data found for the specified province" };
        }

        let data: any = []
        querySnapshot.docs.map(doc => {
            data.push(doc.data())
        })

        return data[Math.floor(Math.random() * data.length)]
    } catch (error) {
        console.error("Error fetching activities by province:", error);
        set.status = 500;
        return { error: "An error occurred while fetching activities by province." };
    }
};

export default (app: ElysiaApp) => app
    .get("/", getInfoHandler, GetSchema)
    .get("/getbyid/:id", getIdInfoHandler)
    .get("/getbyprovince/:province", getProvinceInfoHandler)
    .get("/randombyprovince/:province", getRandomActProvinceInfoHandler);