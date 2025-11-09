import type { ElysiaApp } from "../../index";
import { collection, query, getDocs, DocumentData, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import db from "../../lib/firebase";
import { t } from "elysia";

const GetByIdBodySchema = t.Object({
    id: t.String()
});

const RedeemByIdBodySchema = t.Object({
    raw: t.String()
});

const getInfoHandler = async () => {
    let Data: DocumentData[] = [];
    const q = query(collection(db, "redeem"));

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
    const docRef = doc(db, "redeem", docId);

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            userData.id = docSnap.id;

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

const redeemIdInfoHandler = async ({ body, set }: { body: typeof RedeemByIdBodySchema.static, set: { status: number | string } }) => {
    const rawdata = body.raw;
    const realdata = rawdata.split('-')
    const docRef = doc(db, "Users", realdata[0], 'transactions', realdata[1]);

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            if (docSnap.data().idRedeem) {
                set.status = 400;
                return { message: "Already redeemed" };
            }
            await updateDoc(docRef, {
                idRedeem: true,
                redeemAt: serverTimestamp(),
            });

            set.status = 200;
            return "Redeem!";
        } else {
            set.status = 404;
            return { message: "No data found" };
        }
    } catch (error) {
        set.status = 500;
        return { error: "An error occurred while fetching the document" };
    }
};

export default (app: ElysiaApp) => app
    .get("/", getInfoHandler)
    .put("/getbyid", getIdInfoHandler, {
        body: GetByIdBodySchema
    })
    .post("/redeem", redeemIdInfoHandler, {
        body: RedeemByIdBodySchema
    });