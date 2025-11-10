import type { ElysiaApp } from "../../../index";
import db from "../../../lib/firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { t } from "elysia";

const updateBannerBGSchema = {
    body: t.Object({
        url: t.String()
    }),
    headers: t.Object({
        aetheruid: t.String()
    }),
}

const changeUserBanner = async ({ body, set, headers }: { headers: typeof updateBannerBGSchema.headers.static, body: typeof updateBannerBGSchema.body.static, set: { status: number | string } }) => {
    try {
        const { url } = body;
        const uid = headers.aetheruid;

        if (!uid || !url) {
            set.status = 400
            return { error: "All fields are required." }
        }

        const usersRef = collection(db, "Users");
        const userDoc = doc(usersRef, uid);

        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
            await updateDoc(userDoc, {
                bg: url
            });

            return "Done !";
        } else {
            set.status = 404
            return { error: "User not found" }
        }
    } catch (error) {
        set.status = 500
        return { error: "Failed to process user request" }
    }
};

export default (app: ElysiaApp) => app
    .patch("/banner", changeUserBanner, updateBannerBGSchema);