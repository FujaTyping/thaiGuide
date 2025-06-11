import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";
import { collection, getDocs, doc, setDoc, getDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { t } from "elysia";
import { generateRandomId } from '../../lib/randomid';

const userSchema = t.Object({
    userid: t.String()
});

const transactionSchema = t.Object({
    userid: t.String(),
    type: t.String(),
    place: t.String(),
    point: t.String()
});

const getTransactionsByUserId = async ({ body, set }: { body: typeof userSchema.static, set: { status: number | string } }) => {
    try {
        const { userid } = body;

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

const transferUserTransaction = async ({ body, set }: { body: typeof transactionSchema.static, set: { status: number | string } }) => {
    try {
        const { userid, type, place, point } = body;

        if (!userid || !type || !place || !point) {
            set.status = 400;
            return { error: "All fields (userid, type, place, pointget) are required." }
        }

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

        await setDoc(transactionRef, {
            type,
            place,
            point,
            timestamp: serverTimestamp(),
        });

        const userData = userSnapshot.data();
        const currentPoints = userData.point || 0;
        const placeVisit = userData.checkin || 0;
        const pointChange = parseInt(point);
        const newPoints = currentPoints + pointChange;
        const newScan = placeVisit + 1;

        await setDoc(userRef, {
            ...userData,
            point: newPoints,
            checkin: newScan
        });

        return { message: "Transaction added successfully" };
    } catch (error) {
        set.status = 500;
        return { error: "Failed to add transaction" }
    }
};

export default (app: ElysiaApp) => app.put("/getbyuser", getTransactionsByUserId,
    {
        body: userSchema,
    }
)
    .post(
        "/transfer",
        transferUserTransaction,
        {
            body: transactionSchema,
        }
    );