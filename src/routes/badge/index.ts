import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { t } from "elysia";

const userSchema = t.Object({
    userid: t.String()
});

const getBadgesByUserId = async ({ body, set }: { body: typeof userSchema.static, set: { status: number | string } }) => {
    try {
        const { userid } = body;

        if (!userid) {
            set.status = 400;
            return { error: "User ID is required." };
        }

        const badgeCollectionRef = collection(db, "Users", userid, "badge")
        const badgesSnapshot = await getDocs(badgeCollectionRef);

        if (!badgesSnapshot.empty) {
            const badges = badgesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return { badges };
        } else {
            return {
                badges: []
            };
        }
    } catch (error) {
        console.error("Failed to fetch badge:", error);
        set.status = 500;
        return { error: "Failed to process badges request" };
    }
};

export default (app: ElysiaApp) => app
    .put("/getbyuser", getBadgesByUserId,
        {
            body: userSchema,
        }
    )