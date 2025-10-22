import type { ElysiaApp } from "../../index";
import { collection, query, getDocs, DocumentData, orderBy } from "firebase/firestore";
import db from "../../lib/firebase";

const getInfoHandler = async () => {
    let Data: DocumentData[] = [];
    const q = query(collection(db, "Users"), orderBy("point", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        let qd = doc.data();
        if (!qd.partners) {
            Data.push({
                name: qd.name,
                checkin: qd.checkin,
                point: qd.point,
                pfp: qd.pfp,
                streak: qd.streak,
                id: btoa(doc.id)
            });
        }
    });

    return Data;
};

const getCheckInfoHandler = async () => {
    let Data: DocumentData[] = [];
    const q = query(collection(db, "Users"), orderBy("checkin", "desc"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        let qd = doc.data();
        if (!qd.partners) {
            Data.push({
                name: qd.name,
                checkin: qd.checkin,
                point: qd.point,
                pfp: qd.pfp,
                streak: qd.streak,
                id: btoa(doc.id)
            });
        }
    });

    return Data;
};

export default (app: ElysiaApp) => app
    .get("/getbypoints", getInfoHandler)
    .get("/getbycheckin", getCheckInfoHandler);