import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";
import { collection, getDocs, doc, setDoc, getDoc, serverTimestamp, query, orderBy, addDoc, where } from "firebase/firestore";
import { t } from "elysia";
import { generateRandomId } from '../../lib/randomid';

const userSchema = {
    headers: t.Object({
        aetheruid: t.String()
    })
}

const transactionSchema = {
    body: t.Object({
        type: t.String(),
        place: t.String(),
        point: t.String(),
        isV: t.Optional(t.Boolean()),
        vType: t.Optional(t.String()),
        attach: t.Optional(t.Any())
    }),
    headers: t.Object({
        aetheruid: t.String()
    })
}

const getTransactionsByUserId = async ({ headers, set }: { headers: typeof userSchema.headers.static, set: { status: number | string } }) => {
    try {
        const userid = headers.aetheruid;

        if (!userid) {
            set.status = 400;
            return { error: "User ID is required." };
        }

        const transactionsCollectionRef = query(collection(db, "Users", userid, "transactions"), orderBy("timestamp", "desc"))
        const transactionsSnapshot = await getDocs(transactionsCollectionRef);

        if (!transactionsSnapshot.empty) {
            const transactions = transactionsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return { transactions };
        } else {
            return {
                transactions: []
            };
        }
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        set.status = 500;
        return { error: "Failed to process transactions request" };
    }
};

const transferUserTransaction = async ({ body, set, headers }: { headers: typeof transactionSchema.headers.static, body: typeof transactionSchema.body.static, set: { status: number | string } }) => {
    try {
        const { type, place, point, isV, vType, attach } = body;
        const userid = headers.aetheruid;

        if (!userid || !type || !place || !point) {
            set.status = 400;
            return { error: "All fields (userid, type, place, pointget) are required." }
        }
        let returnDatt = { message: "Transaction added successfully" } as any;

        const transacid = generateRandomId();

        const userRef = doc(db, "Users", userid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            set.status = 404;
            return { error: "User does not exist" };
        }

        const transactionRef = doc(
            collection(db, "Users", userid, "transactions"),
            transacid
        );

        let payloadData = {
            type,
            place,
            point,
            timestamp: serverTimestamp(),
        } as any

        const userData = userSnapshot.data();

        if (userData.point < parseInt(point.slice(1)) && point.split("")[0] == "-") {
            set.status = 400;
            return "NENP!"
        }

        if (isV) {
            if (vType == "background") {
                const docRefI = doc(db, "customize", "user", "banner", attach);
                const docSnapI = await getDoc(docRefI);
                if (docSnapI.exists()) {
                    const bannerCollectionRef = collection(db, "Users", userid, 'inventory');
                    const q = query(bannerCollectionRef, where("title", "==", place));
                    const bannersSnapshot = await getDocs(q);
                    const IDATA = docSnapI.data();
                    if (bannersSnapshot.empty) {
                        await addDoc(collection(db, "Users", userid, 'inventory'), {
                            ...IDATA,
                            type: "background"
                        });
                        returnDatt.isV = true;
                    } else {
                        set.status = 400;
                        return "ITES";
                    }
                } else {
                    set.status = 500;
                    return "ITNF";
                }
            }
            payloadData.idRedeem = true;
            payloadData.redeemAt = serverTimestamp();
            payloadData.locateTo = 'profile';
        }

        await setDoc(transactionRef, payloadData);

        const currentPoints = userData.point || 0;
        const placeVisit = userData.checkin || 0;
        const pointChange = parseInt(point);
        const newPoints = currentPoints + pointChange;
        const newScan = point.includes('-') ? placeVisit : placeVisit + 1;

        await setDoc(userRef, {
            ...userData,
            point: newPoints,
            checkin: newScan
        });

        return returnDatt;
    } catch (error) {
        set.status = 500;
        return { error: "Failed to add transaction", message: error }
    }
};

export default (app: ElysiaApp) => app
    .put("/getbyuser", getTransactionsByUserId, userSchema)
    .post("/transfer", transferUserTransaction, transactionSchema);