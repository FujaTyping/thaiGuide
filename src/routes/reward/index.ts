import type { ElysiaApp } from "../../index";
import { collection, query, getDocs, DocumentData, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import db from "../../lib/firebase";
import { t } from "elysia";
import axios from "axios";
import config from "../../config.json";
import validateAdmin from "../../lifecycle/admin";

const GetByIdBodySchema = {
    body: t.Object({
        id: t.String()
    })
};

const RedeemByIdBodySchema = t.Object({
    raw: t.String()
});

const userRSchema = {
    body: t.Object({
        type: t.String(),
        place: t.String(),
        point: t.String(),
        isV: t.Optional(t.Boolean()),
        vType: t.Optional(t.String()),
        attach: t.Optional(t.Any()),
        itemid: t.String()
    }),
    headers: t.Object({
        aetheruid: t.String()
    })
}

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

const getIdInfoHandler = async ({ body, set }: { body: typeof GetByIdBodySchema.body.static, set: { status: number | string } }) => {
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

async function userRedeem({ body, headers, set }: {
    body: typeof userRSchema.body.static,
    headers: typeof userRSchema.headers.static,
    set: { status: number | string }
}) {
    const { itemid } = body;

    const docRef = doc(db, "redeem", itemid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const itemData = docSnap.data();
        if (itemData.quantity !== 'Unlimited' && itemData.quantity <= 0) {
            set.status = 400;
            return "OOS";
        }

        if (itemData.quantity !== 'Unlimited') {
            await updateDoc(docRef, {
                quantity: itemData.quantity - 1
            });
        }

        try {
            const res = await axios.post(`http://${config.server}/transactions/transfer`, {
                ...body
            }, {
                headers
            });
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                set.status = error.response.status;
                return error.response.data;
            }
            set.status = 400;
            return { message: "An internal error occurred during the transaction." };
        }
    } else {
        set.status = 400;
        return "Item not found";
    }
}

export default (app: ElysiaApp) => app
    .get("/", getInfoHandler)
    .put("/getbyid", getIdInfoHandler, GetByIdBodySchema)
    .post("/redeem", redeemIdInfoHandler, {
        body: RedeemByIdBodySchema,
        async beforeHandle({ bearer, set }) {
            const validate = await validateAdmin({ token: bearer });
            if (!validate) {
                set.status = 401;
                return 'Unauthorized';
            }
        }
    })
    .post("/getmine", userRedeem, userRSchema);