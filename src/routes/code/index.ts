import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface GetByIdBody {
    id: string;
}

const getInfoHandler = async ({ body, set }: { body: GetByIdBody, set: { status: number | string } }) => {
    if (!body || typeof body.id !== 'string' || body.id.trim() === "") {
        set.status = 400;
        return { error: "Property 'id' is missing or invalid in the request body." };
    }

    const docId = body.id;
    const docRef = doc(db, "codes", docId);

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            set.status = 200;
            return docSnap.data();
        } else {
            set.status = 404;
            return { message: "No code found" };
        }
    } catch (error) {
        console.error("Error fetching document:", error);
        set.status = 500;
        return { error: "An error occurred while fetching the document." };
    }
};

export default (app: ElysiaApp) => app.put("/getbyid", getInfoHandler);