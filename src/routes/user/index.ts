import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";
import { collection, doc, getDoc, setDoc, getDocs } from "firebase/firestore";
import { t } from "elysia";

const userSchema = t.Object({
    userid: t.String(),
    name: t.String(),
    pfp: t.String()
});

const createUser = async ({ body, set }: { body: typeof userSchema.static, set: { status: number | string } }) => {
    try {
        const { userid, name, pfp } = body;

        if (!userid || !name || !pfp) {
            set.status = 400
            return { error: "All fields (userid, name) are required." }
        }

        const usersRef = collection(db, "Users");
        const userDoc = doc(usersRef, userid);

        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            return userData;
        }

        const userCreateData = {
            name,
            pfp,
            point: 0,
            checkin: 0
        }

        await setDoc(userDoc, userCreateData);

        return userCreateData;
    } catch (error) {
        set.status = 500
        return { error: "Failed to process user request" }
    }
};

export default (app: ElysiaApp) => app.post("/", createUser,
    {
        body: userSchema,
    }
);