import { t } from "elysia";
import type { ElysiaApp } from "../../../index";
import db from "../../../lib/firebase";
import { addDoc, collection, deleteDoc, doc, GeoPoint, getDocs } from "firebase/firestore";

const newBodySchema = t.Object({
    name: t.String(),
    province: t.String(),
    location: t.Object({
        lat: t.Number(),
        lng: t.Number()
    }),
    points: t.Number(),
    onetime: t.Optional(t.Boolean())
});

const deleteBodySchema = t.Object({
    id: t.String()
})

const newCode = async ({ body, set }: { body: typeof newBodySchema.static, set: { status: number | string } }) => {
    const { name, province, location, points } = body;
    try {
        let payload = {
            name,
            location: new GeoPoint(location.lat, location.lng),
            points,
            province
        } as any;

        if (body.onetime) payload.otpp = body.onetime;

        const docRef = await addDoc(collection(db, "codes"), payload);

        return { message: "Done", id: docRef.id };
    } catch (error) {
        console.error("Failed create now code:", error);
        set.status = 500;
        return { error: "Failed create now code" };
    }
};

const getCode = async ({ set }: { set: { status: number | string } }) => {
    try {
        let data: any = [];
        const querySnapshot = await getDocs(collection(db, "codes"));
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

const deleteCode = async ({ body, set }: { body: typeof deleteBodySchema.static, set: { status: number | string } }) => {
    try {
        const { id } = body;
        await deleteDoc(doc(db, "codes", id));
        return "Done !";
    } catch (error) {
        console.error("Failed to detele code:", error);
        set.status = 500;
        return { error: "Failed to detele code" };
    }
};

export default (app: ElysiaApp) => app
    .post("/new", newCode, {
        body: newBodySchema
    })
    .get("/getall", getCode)
    .delete("/remove", deleteCode, {
        body: deleteBodySchema
    });