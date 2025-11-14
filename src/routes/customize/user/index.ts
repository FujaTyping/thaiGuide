import { t } from "elysia";
import type { ElysiaApp } from "../../../index";
import db from "../../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

const newNameBodySchema = {
    body: t.Object({
        name: t.String()
    }),
    headers: t.Object({
        aetheruid: t.String()
    })
};

const newBioBodySchema = {
    body: t.Object({
        bio: t.String()
    }),
    headers: t.Object({
        aetheruid: t.String()
    })
};

const newName = async ({ body, headers, set }: { body: typeof newNameBodySchema.body.static, headers: typeof newNameBodySchema.headers.static, set: { status: number | string } }) => {
    const { name } = body;
    const uid = headers.aetheruid;

    try {
        const userRef = doc(db, "Users", uid);

        await updateDoc(userRef, {
            name
        });
        return "Done !";
    } catch (errorname) {
        console.error("Failed to rename:", errorname);
        set.status = 500;
        return { error: "Failed to rename" };
    }
};

const bioName = async ({ body, headers, set }: { headers: typeof newBioBodySchema.headers.static, body: typeof newBioBodySchema.body.static, set: { status: number | string } }) => {
    const { bio } = body;
    const uid = headers.aetheruid;

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
    .post("/name", newName, newNameBodySchema)
    .post("/bio", bioName, newBioBodySchema);