import { t } from "elysia";
import type { ElysiaApp } from "../../../index";
import db from "../../../lib/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import client from "../../../lib/imagekit";

const newSchema = {
    body: t.Object({
        by: t.String(),
        decs: t.String(),
        image: t.File({ type: 'image/*' }),
        name: t.String(),
        quantity: t.String(),
        require: t.String(),
        attach: t.Optional(t.String()),
        type: t.Optional(t.String()),
        virtual: t.Optional(t.String())
    })
}

const removeSchema = {
    body: t.Object({
        id: t.String(),
        fid: t.String()
    })
}

const updateQuanSchema = {
    body: t.Object({
        id: t.String(),
        quantity: t.String()
    })
}

const getProduct = async ({ set }: { set: { status: number | string } }) => {
    try {
        let data: any = [];
        const querySnapshot = await getDocs(collection(db, "redeem"));
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

interface Product {
    by: string;
    decs: string;
    image: string | undefined;
    name: string;
    quantity: string;
    require: string;
    attact?: string;
    type?: string;
    virtual?: boolean;
}

async function addNew({ body, set }: { body: typeof newSchema.body.static, set: { status: number } }) {
    const { by, decs, image, name, quantity, require, attach, type, virtual } = body;

    let payload = {
        by,
        decs,
        name,
        require
    } as Product

    payload.quantity = parseInt(quantity) < 0 ? "Unlimited" : quantity;

    if (virtual == "true") {
        payload.virtual = true;
        payload.attact = attach;
        payload.type = type;
    }

    try {
        const response = await client.files.upload({
            file: image,
            fileName: `${name}.jpg`,
            folder: 'thaiGuide/reward'
        });
        const uploadURL = response.url;
        payload.image = uploadURL;

        const docRef = await addDoc(collection(db, "redeem"), {
            ...payload,
            fileid: response.fileId
        });

        set.status = 200;
        return docRef.id;
    } catch {
        set.status = 400;
        return "Faild to add new reward";
    }
}

async function removeItem({ body, set }: { body: typeof removeSchema.body.static, set: { status: number } }) {
    const { id, fid } = body;

    try {
        await deleteDoc(doc(db, "redeem", id));
        await client.files.delete(fid);
        set.status = 200;
        return "Done !";
    } catch {
        set.status = 400;
        return "Faild to delete reward";
    }
}

async function chagenQUAN({ body, set }: { body: typeof updateQuanSchema.body.static, set: { status: number } }) {
    const { id, quantity } = body;

    try {
        const rwRef = doc(db, "redeem", id);
        await updateDoc(rwRef, {
            quantity
        });

        set.status = 200;
        return "Done";
    } catch {
        set.status = 400;
        return "Faild to update quantity";
    }
}

export default (app: ElysiaApp) => app
    .get("/getall", getProduct)
    .post("/newitem", addNew, newSchema)
    .delete("/delete", removeItem, removeSchema)
    .patch("/quantityChange", chagenQUAN, updateQuanSchema);