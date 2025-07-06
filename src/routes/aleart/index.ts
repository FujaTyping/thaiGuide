import type { ElysiaApp } from "../../index";
import { doc, getDoc } from "firebase/firestore";
import db from "../../lib/firebase";

const getIdInfoHandler = async ({ set }: { set: { status: number | string } }) => {
    const docRef = doc(db, "stream", "aleart");

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();

            set.status = 200;
            return userData;
        } else {
            set.status = 404;
            return { message: "No data found" };
        }
    } catch (error) {
        set.status = 500;
        return { error: "An error occurred while fetching the document" };
    }
};

export default (app: ElysiaApp) => app
    .get("/", getIdInfoHandler)