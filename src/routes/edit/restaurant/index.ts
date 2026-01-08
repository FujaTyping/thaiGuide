import { t } from "elysia";
import type { ElysiaApp } from "../../../index";
import db from "../../../lib/firebase";
import { collection, addDoc, getDocs, doc, query, deleteDoc, updateDoc } from "firebase/firestore";
import client from "../../../lib/imagekit";
import 'dotenv/config';
import validateAdmin from "../../../lifecycle/admin";

// Content type : multipart/form-data
const newSchema = {
    body: t.Object({
        thumnails: t.File({ type: 'image/*' }),
        image: t.File({ type: 'image/*' }),
        name: t.String(),
        decs: t.String(),
        link: t.String(),
        location: t.String(),
        price: t.String(),
        province: t.String(),
        rating: t.String(),
        spicylevel: t.String(),
        streetview: t.String()
    })
}

const deleteSchema = {
    body: t.Object({
        id: t.String(),
        ifid: t.String(),
        tfid: t.String()
    })
}

async function getRestaurant({ set }: { set: { status: number } }) {
    const q = query(collection(db, "restaurant"));
    let data: any = [];

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        let datt = doc.data();
        datt.id = doc.id;
        data.push(datt);
    });

    set.status = 200;
    return data;
}

async function addNewRestaurant({ body, set }: { body: typeof newSchema.body.static, set: { status: number } }) {
    const { thumnails, image, name, decs, link, location, price, province, rating, spicylevel, streetview } = body

    try {
        const docRef = await addDoc(collection(db, "restaurant"), {
            name, decs, link, location, price, province, rating, spicylevel, streetview
        });

        const exitsDoc = docRef.id

        const tresponse = await client.files.upload({
            file: thumnails,
            fileName: `${name}-thumnails.jpg`,
            folder: `thaiGuide/restaurant/${exitsDoc}`
        });

        const thumnailsRef = doc(db, "restaurant", exitsDoc);

        await updateDoc(thumnailsRef, {
            thumnails: tresponse.url,
            tfid: tresponse.fileId
        });

        const iresponse = await client.files.upload({
            file: image,
            fileName: `${name}-image.jpg`,
            folder: `thaiGuide/restaurant/${exitsDoc}`
        });

        const imageRef = doc(db, "restaurant", exitsDoc);

        await updateDoc(imageRef, {
            image: iresponse.url,
            ifid: iresponse.fileId
        });

        set.status = 200;
        return "Done !";
    } catch (e: any) {
        set.status = 400;
        return e.message;
    }
}

async function deleteData({ body, set }: { body: typeof deleteSchema.body.static, set: { status: number } }) {
    const { id, ifid, tfid } = body;

    try {
        await deleteDoc(doc(db, "restaurant", id));
        await client.files.delete(ifid);
        await client.files.delete(tfid);
        set.status = 200;
        return "Done !";
    } catch (error) {
        set.status = 400;
        return { error: "Failed to delete restaurant" };
    }
}

export default (app: ElysiaApp) => app
    .get('/getall', getRestaurant)
    .post('/add', addNewRestaurant, {
        ...newSchema,
        async beforeHandle({ bearer, set }) {
            const validate = await validateAdmin({ token: bearer });
            if (!validate) {
                set.status = 401;
                return 'Unauthorized';
            }
        }
    })
    .delete('/remove', deleteData, {
        ...deleteSchema,
        async beforeHandle({ bearer, set }) {
            const validate = await validateAdmin({ token: bearer });
            if (!validate) {
                set.status = 401;
                return 'Unauthorized';
            }
        }
    })