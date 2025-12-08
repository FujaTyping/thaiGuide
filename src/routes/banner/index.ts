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

    Data.sort((a, b) => {
        return (b.priority === true ? 1 : 0) - (a.priority === true ? 1 : 0);
    });

    return Data;
};

export default (app: ElysiaApp) => app
    .get("/", getInfoHandler);