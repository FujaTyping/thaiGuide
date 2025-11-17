import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";
import { collection, doc, getDocs, orderBy, query, setDoc } from "firebase/firestore";
import { t } from "elysia";
import client from "../../lib/imagekit";
import 'dotenv/config';

const userSchema = {
    headers: t.Object({
        aetheruid: t.String()
    })
}

// Content type : multipart/form-data
const newSchema = {
    body: t.Object({
        image: t.File({ type: 'image/*' }),
        name: t.String(),
        slogan: t.String()
    })
}

const getBadgesByUserId = async ({ headers, set }: { headers: typeof userSchema.headers.static, set: { status: number | string } }) => {
    try {
        const userid = headers.aetheruid;

        if (!headers.aetheruid) {
            set.status = 400;
            return { error: "User ID is required." };
        }

        const badgeCollectionRef = query(collection(db, "Users", userid, "badge"), orderBy("recivedAt", "desc"))
        const badgesSnapshot = await getDocs(badgeCollectionRef);

        if (!badgesSnapshot.empty) {
            const badges = badgesSnapshot.docs.map(doc => ({
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

async function addNew({ body, set }: { body: typeof newSchema.body.static, set: { status: number } }) {
    const { image, name, slogan } = body;

    try {
        const response = await client.files.upload({
            file: image,
            fileName: `${name}.jpg`,
            folder: 'thaiGuide/badge'
        });

        const uploadURL = response.url;
        await setDoc(doc(db, "badge", name), {
            url: uploadURL,
            slogan
        });

        set.status = 200;
        return 'Done';
    } catch (e: any) {
        set.status = 400;
        return e.message;
    }
}

export default (app: ElysiaApp) => app
    .put("/getbyuser", getBadgesByUserId, userSchema)
    .post("/new", addNew, newSchema)