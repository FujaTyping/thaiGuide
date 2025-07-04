import type { ElysiaApp } from "../../index";
import { collection, query, getDocs, DocumentData, orderBy } from "firebase/firestore";
import db from "../../lib/firebase";

const getInfoHandler = async () => {
    let Data: DocumentData[] = [];
    const q = query(collection(db, "Banner"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        Data.push(doc.data());
    });

    return Data;
};

export default (app: ElysiaApp) => app
    .get("/", getInfoHandler);