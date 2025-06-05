import type { ElysiaApp } from "../../index";
import { collection, query, getDocs, DocumentData } from "firebase/firestore";
import db from "../../lib/firebase";

const getInfoHandler = async () => {
    let Data: DocumentData[] = [];
    const q = query(collection(db, "activities"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        let qd = doc.data();
        qd.id = doc.id;
        Data.push(qd);
    });

    return Data;
};

export default (app: ElysiaApp) => app.get("/", getInfoHandler);