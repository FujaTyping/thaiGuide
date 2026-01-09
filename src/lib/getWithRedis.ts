import { collection, query as fbquery, getDocs, DocumentData, limit, Query, query } from "firebase/firestore";
import db from "./firebase";
import clientRD from "./redis";

interface getParams {
    name: string;
    limits?: number;
}

async function getWithRedis({
    name, limits
}: getParams) {
    let Data: DocumentData[] = [];

    if (await clientRD.get(`${limits ? `${name}-${limits}` : name}`)) {
        return JSON.parse(await clientRD.get(`${limits ? `${name}-${limits}` : name}`) as string);
    }

    let q: Query;

    if (limits) {
        q = fbquery(collection(db, name), limit(limits));
    } else {
        q = fbquery(collection(db, name));
    }

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        let qd = doc.data();
        qd.id = doc.id;
        Data.push(qd);
    });

    clientRD.set(`${limits ? `${name}-${limits}` : name}`, JSON.stringify(Data));
    clientRD.expire(`${limits ? `${name}-${limits}` : name}`, 600);

    return Data;
}

export default getWithRedis;