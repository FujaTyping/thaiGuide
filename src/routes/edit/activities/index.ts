import { t } from "elysia";
import type { ElysiaApp } from "../../../index";
import db from "../../../lib/firebase";
import { collection, addDoc, getDocs, doc, query, GeoPoint, deleteDoc } from "firebase/firestore";
import client from "../../../lib/imagekit";
import 'dotenv/config';
import validateAdmin from "../../../lifecycle/admin";

// Content type : multipart/form-data
const newSchema = {
    body: t.Object({
        thumnails: t.File({ type: 'image/*' }),
        title: t.String(),
        decs: t.String(),
        direction: t.String(),
        location: t.String(),
        lat: t.String(),
        lon: t.String(),
        ndtitle: t.String(),
        province: t.String(),
        rating: t.String()
    })
}

// const additionalDataSchema = {
//     body: t.Object({
//         popular: t.Optional(t.String()),
//         pricing: t.Optional(t.String()),
//         tel: t.Optional(t.String()),
//         website: t.Optional(t.String())
//     })
// }

const deleteSchema = {
    body: t.Object({
        id: t.String(),
        fid: t.String()
    })
}

async function getActivities({ set }: { set: { status: number } }) {
    const q = query(collection(db, "activities"));
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

async function addNewActivities({ body, set }: { body: typeof newSchema.body.static, set: { status: number } }) {
    const { thumnails, title, decs, direction, location, lat, lon, ndtitle, province, rating } = body

    try {
        const response = await client.files.upload({
            file: thumnails,
            fileName: `${title}.jpg`,
            folder: 'thaiGuide/activities'
        });

        const image = response.url;
        const fileID = response.fileId;

        const docRef = await addDoc(collection(db, "activities"), {
            thumnails: image,
            fileid: fileID,
            title,
            decs,
            direction,
            location,
            maplocation: new GeoPoint(parseFloat(lat), parseFloat(lon)),
            ndtitle,
            province,
            rating
        });

        set.status = 200;
        return docRef.id;
    } catch (e: any) {
        set.status = 400;
        return e.message;
    }
}

// WAITING FOR PART 1 TESTING
// function updateDetails({ body, set }: { body: typeof additionalDataSchema.body.static, set: { status: number } }) {
//     const { popular, pricing, tel, website } = body
// }

async function deleteData({ body, set }: { body: typeof deleteSchema.body.static, set: { status: number } }) {
    const { id, fid } = body;

    try {
        await deleteDoc(doc(db, "activities", id));
        await client.files.delete(fid);
        set.status = 200;
        return "Done !";
    } catch (error) {
        set.status = 400;
        return { error: "Failed to delete activities" };
    }
}

export default (app: ElysiaApp) => app
    .get('/getall', getActivities)
    .post('/add', addNewActivities, {
        ...newSchema,
        async beforeHandle({ bearer, set }) {
            const validate = await validateAdmin({ token: bearer });
            if (!validate) {
                set.status = 401;
                return 'Unauthorized';
            }
        }
    })
    // .patch('/updateDetails', updateDetails, {
    //     ...additionalDataSchema,
    //     async beforeHandle({ bearer, set }) {
    //         const validate = await validateAdmin({ token: bearer });
    //         if (!validate) {
    //             set.status = 401;
    //             return 'Unauthorized';
    //         }
    //     }
    // })
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