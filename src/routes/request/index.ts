import type { ElysiaApp } from "../../index";
import { doc, setDoc } from "firebase/firestore";
import db from "../../lib/firebase";
import { t } from "elysia";
import { generateRandomId } from '../../lib/randomid';

const newResBodySchema = t.Object({
    slevel: t.String(),
    title: t.String(),
    decs: t.String(),
    tel: t.String(),
    openhour: t.String(),
    province: t.String(),
    gmaps: t.String(),
    address: t.String()
});

const newResHandler = async ({ body, set }: { body: typeof newResBodySchema.static, set: { status: number | string } }) => {
    const { slevel, title, decs, tel, openhour, province, gmaps, address } = body;

    try {
        await setDoc(doc(db, "wrestaurant", generateRandomId()), {
            slevel,
            title,
            decs,
            tel,
            openhour,
            province,
            gmaps,
            address
        });

        set.status = 200;
        return "Done !";
    } catch (error) {
        console.error("Error adding document:", error);
        set.status = 500;
        return { error: "Error adding document" };
    }
};

export default (app: ElysiaApp) => app
    .post("/restaurant", newResHandler, {
        body: newResBodySchema
    });