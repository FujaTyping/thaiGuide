import { t } from "elysia";
import type { ElysiaApp } from "../../../index";
import db from "../../../lib/firebase";
import { collection, addDoc, getDocs, doc, query, GeoPoint, deleteDoc, updateDoc, getDoc, setDoc } from "firebase/firestore";
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

const dataDetails = {
    query: t.Object({
        id: t.String()
    })
}

const updateDetailsSchema = {
    body: t.Object({
        id: t.String(),
        key: t.String(),
        value: t.String()
    })
}

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

async function getDetailsId({ query, set }: { query: typeof dataDetails.query.static, set: { status: number } }) {
    const { id } = query;

    try {
        let data: any = {};
        const querySnapshot = await getDocs(collection(db, "activities", id, "details"));
        querySnapshot.forEach((doc) => {
            data[doc.id] = doc.data().value;
        });

        set.status = 200;
        return data;
    } catch {
        set.status = 400;
        return "No such document!";
    }
}

async function updateDetails({ body, set }: { body: typeof updateDetailsSchema.body.static, set: { status: number } }) {
    const { value, id, key } = body

    const docRef = doc(db, "activities", id, "details", key);
    const docSnap = await getDoc(docRef);
    try {
        if (docSnap.exists()) {
            const detailsRef = doc(db, "activities", id, "details", key);

            await updateDoc(detailsRef, {
                value
            });
        } else {
            await setDoc(doc(db, "activities", id, "details", key), {
                value
            });
        }

        set.status = 200;
        return "Done !";
    } catch (e) {
        set.status = 400;
        return "Can't update the activities details";
    }
}

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
    .get('/getdetailsfromid', getDetailsId, dataDetails)
    .patch('/updateDetails', updateDetails, {
        ...updateDetailsSchema,
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