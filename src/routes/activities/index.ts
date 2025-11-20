import type { ElysiaApp } from "../../index";
import { collection, query, getDocs, DocumentData, doc, getDoc, where, orderBy } from "firebase/firestore";
import db from "../../lib/firebase";
import { t } from "elysia";

const GetByIdBodySchema = t.Object({
    id: t.String()
});

const GetByProvinceBodySchema = t.Object({
    province: t.String()
});

const GetRandomActivitiesProvinceBodySchema = t.Object({
    province: t.String()
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

                if (userData.haveticket) {
                    let ticket: any = [];
                    const tickRef = collection(db, "activities", docId, "ticket")
                    const tickSnapshot = await getDocs(query(tickRef , orderBy("price", "asc")))

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
        return { error: "An error occurred while fetching the document." };
    }
};

const getProvinceInfoHandler = async ({ body, set }: { body: typeof GetByProvinceBodySchema.static, set: { status: number | string } }) => {
    const targetProvince = body.province;

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

const getRandomActProvinceInfoHandler = async ({ body, set }: { body: typeof GetRandomActivitiesProvinceBodySchema.static, set: { status: number | string } }) => {
    const { province } = body;

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
    .get("/", getInfoHandler)
    .put("/getbyid", getIdInfoHandler, {
        body: GetByIdBodySchema
    })
    .put("/getbyprovince", getProvinceInfoHandler, {
        body: GetByProvinceBodySchema
    })
    .put("/randombyprovince", getRandomActProvinceInfoHandler, {
        body: GetRandomActivitiesProvinceBodySchema
    });