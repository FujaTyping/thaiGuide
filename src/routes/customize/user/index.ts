import { t } from "elysia";
import type { ElysiaApp } from "../../../index";
import db from "../../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

const newNameBodySchema = t.Object({
    uid: t.String(),
    name: t.String(),
});

const newBioBodySchema = t.Object({
    uid: t.String(),
    bio: t.String(),
});

const newName = async ({ body, set }: { body: typeof newNameBodySchema.static, set: { status: number | string } }) => {
    const { uid, name } = body;
    try {
        const userRef = doc(db, "Users", uid);

        await updateDoc(userRef, {
            name
        });
        return "Done !";
    } catch (error) {
        console.error("Failed to rename:", error);
        set.status = 500;
        return { error: "Failed to rename" };
    }
};

const bioName = async ({ body, set }: { body: typeof newBioBodySchema.static, set: { status: number | string } }) => {
    const { uid, bio } = body;
    try {
        const userRef = doc(db, "Users", uid);

        await updateDoc(userRef, {
            bio
        });
        return "Done !";
    } catch (error) {
        console.error("Failed to rename:", error);
        set.status = 500;
        return { error: "Failed to rename" };
    }
};

export default (app: ElysiaApp) => app
    .post("/name", newName, {
        body: newNameBodySchema
    })
    .post("/bio", bioName, {
        body: newBioBodySchema
    });