import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { t } from "elysia";

const GetByIdBodySchema = t.Object({
    id: t.String(),
    uid: t.String(),
    year: t.Number()
});

const getInfoHandler = async ({ body, set }: { body: typeof GetByIdBodySchema.static, set: { status: number | string } }) => {
    const { id, uid, year } = body
    const docId = id;
    const docRef = doc(db, "codes", docId);
    const docuId = uid;
    const usersRef = collection(db, "Users");
    const userDoc = doc(usersRef, docuId);

    try {
        const docSnap = await getDoc(docRef);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const userData = userSnapshot.data();
                let STEAK = 0;
                if (!userData.streakYRS || (userData.streakYRS != year && year > userData.streakYRS)) {
                    if (year - userData.streakYRS >= 2) {
                        STEAK = 1;
                        await updateDoc(userDoc, {
                            streakYRS: year,
                            streak: STEAK
                        });
                    } else {
                        STEAK = userData.streak + 1;
                        await updateDoc(userDoc, {
                            streakYRS: year,
                            streak: STEAK
                        });
                    }
                }
                data.streakYRS = year
                data.streak = STEAK;
                set.status = 200;
                return data;
            } else {
                set.status = 404;
                return { message: "No code found" };
            }
        } else {
            set.status = 404;
            return { message: "User not found" };
        }
    } catch (error) {
        set.status = 500;
        return { error: "An error occurred while fetching the document." };
    }
};

export default (app: ElysiaApp) => app.put("/getbyid", getInfoHandler, {
    body: GetByIdBodySchema
});