import { t } from "elysia";
import type { ElysiaApp } from "../../../index";
import db from "../../../lib/firebase";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import client from "../../../lib/imagekit";
import 'dotenv/config';

// Content type : multipart/form-data
const newSchema = {
    body: t.Object({
        image: t.File({ type: 'image/*' }),
        name: t.String(),
        slogan: t.String()
    })
}

const deleteSchema = {
    body: t.Object({
        id: t.String(),
        fid: t.String()
    })
}

const getCode = async ({ set }: { set: { status: number | string } }) => {
    try {
        let data: any = [];
        const querySnapshot = await getDocs(collection(db, "badge"));
        querySnapshot.forEach((doc) => {
            const resd = doc.data();
            data.push({
                id: doc.id,
                ...resd
            })
        });
        return data;
    } catch (error) {
        console.error("Failed to get all code:", error);
        set.status = 500;
        return { error: "Failed to get all code" };
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
            slogan,
            fileid: response.fileId
        });

        set.status = 200;
        return 'Done';
    } catch (e: any) {
        set.status = 400;
        return e.message;
    }
}

async function deleteData({ body, set }: { body: typeof deleteSchema.body.static, set: { status: number } }) {
    const { id, fid } = body;

    try {
        await deleteDoc(doc(db, "badge", id));
        await client.files.delete(fid);
        set.status = 200;
        return "Done !";
    } catch (error) {
        console.error("Failed to detele  badge :", error);
        set.status = 400;
        return { error: "Failed to detele  badge " };
    }
}

export default (app: ElysiaApp) => app
    .get("/getall", getCode)
    .post("/new", addNew, newSchema)
    .delete('/delete', deleteData, deleteSchema);