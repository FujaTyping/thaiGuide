import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";
import { collection, doc, DocumentData, getDoc, getDocs, query, setDoc, updateDoc } from "firebase/firestore";
import { t } from "elysia";
import { getDistance } from 'geolib';
import axios from "axios";
import config from "../../config.json";

const GetByIdBodySchema = t.Object({
    id: t.String(),
    uid: t.String(),
    year: t.Number(),
    location: t.Object({
        latitude: t.Number(),
        longitude: t.Number()
    })
});

const getInfoHandler = async ({ body, set }: { body: typeof GetByIdBodySchema.static, set: { status: number | string } }) => {
    const { id, uid, year, location } = body
    const docId = id;
    const docRef = doc(db, "codes", docId);
    const docuId = uid;
    const usersRef = collection(db, "Users");
    const userDoc = doc(usersRef, docuId);
    const scanRef = doc(db, "Users", uid, "scanqr", id);

    try {
        const docSnap = await getDoc(docRef);
        const scanSnap = await getDoc(scanRef);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const userData = userSnapshot.data();
                const distanceInMeters = getDistance(
                    { latitude: location.latitude, longitude: location.longitude },
                    { latitude: data.location.latitude, longitude: data.location.longitude }
                );
                let SetPoint = data.points;
                if (scanSnap.exists() && scanSnap.data().count > 0) {
                    const ScanToAdd = scanSnap.data().count + 1;
                    const PointsDeduct = (data.points / ScanToAdd).toFixed(0);
                    SetPoint = PointsDeduct;
                    data.points = PointsDeduct;
                    await updateDoc(scanRef, {
                        count: ScanToAdd
                    })
                    data.originalpoint = data.points;
                    data.samespot = true;
                } else {
                    await setDoc(scanRef, {
                        count: 1
                    })
                    data.samespot = false;
                }
                const distanceInKm = distanceInMeters / 1000;
                if (distanceInKm <= 3) {
                    await axios.post(`http://${config.server}/transactions/transfer`, {
                        userid: uid,
                        type: "Scan QR",
                        place: data.name,
                        point: `+${SetPoint}`
                    })
                } else {
                    set.status = 200;
                    return "NNL";
                }
                let STEAK = userData.streak || 0;
                if (!userData.streakYRS || (userData.streakYRS != year && year > userData.streakYRS)) {
                    if (year - userData.streakYRS >= 2) {
                        STEAK = 1;
                        await updateDoc(userDoc, {
                            streakYRS: year,
                            streak: STEAK
                        });
                    } else {
                        STEAK = userData.streak + 1;
                        await updateDoc(userDoc, {
                            streakYRS: year,
                            streak: STEAK
                        });
                    }
                }
                data.streakYRS = year
                data.streak = STEAK;
                set.status = 200;
                return data;
            } else {
                set.status = 404;
                return { message: "No code found" };
            }
        } else {
            set.status = 404;
            return { message: "User not found" };
        }
    } catch (error: any) {
        set.status = 500;
        return { error: "An error occurred while fetching the document", message: error };
    }
};

const getMapInfoHandler = async ({ set }: { set: { status: number | string } }) => {
    let Data: DocumentData[] = [];
    const q = query(collection(db, "codes"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        Data.push(doc.data().location);
    });

    return Data;
};

export default (app: ElysiaApp) => app
    .put("/getbyid", getInfoHandler, {
        body: GetByIdBodySchema
    })
    .get("/randommap", getMapInfoHandler);