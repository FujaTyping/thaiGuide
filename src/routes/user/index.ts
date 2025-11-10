import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";
import { collection, doc, getDoc, setDoc, getDocs, serverTimestamp, deleteDoc, query } from "firebase/firestore";
import { t } from "elysia";

const userSchema = {
    body: t.Object({
        name: t.String(),
        pfp: t.String()
    }),
    headers: t.Object({
        aetheruid: t.String()
    })
};

const publicUserSchema = {
    headers: t.Object({
        aetheruid: t.String()
    })
}

const deleteUserSchema = {
    headers: t.Object({
        aetheruid: t.String()
    })
}

const createUser = async ({ body, headers, set }: { body: typeof userSchema.body.static, headers: typeof userSchema.headers.static, set: { status: number | string } }) => {
    try {
        const { name, pfp } = body;
        const userid = headers.aetheruid;

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

const publicUser = async ({ headers, set }: { headers: typeof publicUserSchema.headers.static, set: { status: number | string } }) => {
    try {
        const uid = headers.aetheruid;

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

const deleteUser = async ({ headers, set }: { headers: typeof deleteUserSchema.headers.static, set: { status: number | string } }) => {
    try {
        const uid = headers.aetheruid;
        const userDocRef = doc(db, "Users", uid);

        const subcollections = ['inventory', 'badge', 'quiz', 'scanqr', 'transactions'];

        for (const subcollectionName of subcollections) {
            const subcollectionRef = collection(userDocRef, subcollectionName);
            const subcollectionSnapshot = await getDocs(query(subcollectionRef));
            const deletePromises = subcollectionSnapshot.docs.map(docSnapshot => deleteDoc(docSnapshot.ref));
            await Promise.all(deletePromises);
        }

        await deleteDoc(userDocRef);

        set.status = 200;
        return "Done !";
    } catch (error) {
        set.status = 500
        return { error: "Failed to process user deletion request" }
    }
};

export default (app: ElysiaApp) => app
    .post("/", createUser, userSchema)
    .put("/public", publicUser, publicUserSchema)
    .delete('/delete', deleteUser, deleteUserSchema);