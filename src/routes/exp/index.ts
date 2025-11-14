import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";
import { t } from "elysia";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

const expTable = [0, 50, 75, 100, 125, 175, 225, 250, 300, 350, 450];

const addExpSchema = {
    headers: t.Object({
        aetheruid: t.String()
    }),
    body: t.Object({
        point: t.Number()
    })
};

const addExp = async ({
    headers,
    body,
    set
}: {
    headers: typeof addExpSchema.headers.static,
    body: typeof addExpSchema.body.static,
    set: { status: number | string }
}) => {
    try {
        const userid = headers.aetheruid;
        const { point } = body;

        if (!userid || typeof point !== "number") {
            set.status = 400;
            return { error: "User ID and point are required." };
        }

        const usersRef = collection(db, "Users");
        const userDocRef = doc(usersRef, userid);
        const userSnapshot = await getDoc(userDocRef);

        if (!userSnapshot.exists()) {
            set.status = 404;
            return { error: "User not found" };
        }

        let { lv = 1, exp = 0 } = userSnapshot.data() as { lv?: number, exp?: number };
        let newExp = exp + point;
        let newLv = lv;

        while (newLv < expTable.length - 1 && newExp >= expTable[newLv]) {
            newExp -= expTable[newLv];
            newLv += 1;
        }

        const nextexp = newLv < expTable.length - 1 ? expTable[newLv] : 0;
        
        await updateDoc(userDocRef, { lv: newLv, exp: newExp, nextexp });

        return { lv: newLv, exp: newExp, nextexp };
    } catch (error) {
        set.status = 500;
        return { error: "Failed to add exp" };
    }
};

export default (app: ElysiaApp) => app
    .post("/add", addExp, addExpSchema);