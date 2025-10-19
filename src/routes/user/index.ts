import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";
import { collection, doc, getDoc, setDoc, getDocs, serverTimestamp, deleteDoc } from "firebase/firestore";
import { t } from "elysia";

const userSchema = t.Object({
    userid: t.String(),
    name: t.String(),
    pfp: t.String()
});

const publicUserSchema = t.Object({
    uid: t.String()
})

const deleteUserSchema = t.Object({
    uid: t.String()
})

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

        let userCreateData = {
            name,
            pfp,
            point: 0,
            checkin: 0,
            streak: 0,
            joinAt: serverTimestamp(),
            bg: "https://ik.imagekit.io/61sqw5prw/thaiGuide/profilebn/5.jpg?updatedAt=1760156459397"
        }

        await setDoc(userDoc, userCreateData);
        return { ...userCreateData, new: true };
    } catch (error) {
        set.status = 500
        return { error: "Failed to process user request" }
    }
};

const publicUser = async ({ body, set }: { body: typeof publicUserSchema.static, set: { status: number | string } }) => {
    try {
        const { uid } = body;

        if (!uid) {
            set.status = 400
            return { error: "All fields userid are required." }
        }

        const userID = atob(uid)
        const usersRef = collection(db, "Users");
        const userDoc = doc(usersRef, userID);

        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            let resData = {
                name: userData.name,
                pfp: userData.pfp,
                point: userData.point,
                checkin: userData.checkin,
                joinAt: userData.joinAt,
                bg: userData.bg
            } as any
            const badgeCollectionRef = collection(db, "Users", userID, "badge")
            const badgesSnapshot = await getDocs(badgeCollectionRef);

            if (!badgesSnapshot.empty) {
                const badges = badgesSnapshot.docs.map(doc => ({
                    ...doc.data()
                }));
                resData.badges = badges;
            } else {
                resData.badges = []
            }
            return resData;
        } else {
            set.status = 404
            return { error: "User not found" }
        }
    } catch (error) {
        set.status = 500
        return { error: "Failed to process user request" }
    }
};

const deleteUser = async ({ body, set }: { body: typeof deleteUserSchema.static, set: { status: number | string } }) => {
    try {
        const { uid } = body;

        await deleteDoc(doc(db, "Users", uid));

        set.status = 200;
        return "Done !";
    } catch (error) {
        set.status = 500
        return { error: "Failed to process user request" }
    }
};

export default (app: ElysiaApp) => app
    .post("/", createUser,
        {
            body: userSchema,
        }
    )
    .put("/public", publicUser,
        {
            body: publicUserSchema
        }
    )
    .delete('/delete', deleteUser,
        {
            body: deleteUserSchema
        }
    );