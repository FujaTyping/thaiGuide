import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { t } from "elysia";

const userSchema = t.Object({
    userid: t.String()
});

const getTransactionsByUserId = async ({ body, set }: { body: typeof userSchema.static, set: { status: number | string } }) => {
    try {
        const { userid } = body;

        if (!userid) {
            set.status = 400;
            return { error: "User ID is required." };
        }

        const transactionsCollectionRef = collection(db, "Users", userid, "transactions");
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

export default (app: ElysiaApp) => app.put("/getbyuser", getTransactionsByUserId,
    {
        body: userSchema,
    }
);