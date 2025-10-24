import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";
import { collection, doc, GeoPoint, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
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

const GetMyMaps = t.Object({
    uid: t.String()
})

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
                const distanceInKm = distanceInMeters / 1000;
                if (distanceInKm <= 3) {
                    if (scanSnap.exists() && data.otpp) {
                        set.status = 200;
                        return {
                            otpp: true,
                            name: data.name
                        };
                    }
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
                        console.log(data)
                        await setDoc(scanRef, {
                            count: 1,
                            year: year,
                            location: new GeoPoint(data.location.latitude, data.location.longitude),
                            name: data.name
                        })
                        data.samespot = false;
                    }
                    await axios.post(`http://${config.server}/transactions/transfer`, {
                        userid: uid,
                        type: "Scan QR",
                        place: data.name,
                        point: `+${SetPoint}`
                    })
                    if (data.province) {
                        const badgeRef = doc(db, "badge", data.province);
                        const UsrbadgeRef = doc(db, "Users", uid, "badge", data.province);
                        const badgeSnap = await getDoc(badgeRef);
                        const UserbadgeSnap = await getDoc(UsrbadgeRef);
                        if (!UserbadgeSnap.exists()) {
                            const badgeDATA = badgeSnap.data();
                            if (badgeDATA) {
                                const payloadBadge = {
                                    province: badgeSnap.id,
                                    imageUrl: badgeDATA.url,
                                    slogan: badgeDATA.slogan,
                                    recivedAt: serverTimestamp()
                                }
                                await setDoc(UsrbadgeRef, payloadBadge);
                                data.badge = payloadBadge
                                data.reciveNewBadge = true
                            }
                        }
                    }
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
                data.otpp = false;
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

const getMapInfoHandler = async ({ body, set }: { body: typeof GetMyMaps.static, set: { status: number | string } }) => {
    const { uid } = body;

    let Data: any = {
        undiscover: [],
        visited: []
    };
    const q = query(collection(db, "codes"));
    const dis = query(collection(db, "Users", uid, "scanqr"));

    const querySnapshot = await getDocs(q);
    const queryMSnapshot = await getDocs(dis);
    const visitedLocations = new Set<string>();

    queryMSnapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.otpp) {
            const location = data.location as GeoPoint;
            Data.visited.push({
                latitude: location.latitude,
                longitude: location.longitude,
                name: data.name,
                year: data.year
            });
            visitedLocations.add(`${location.latitude},${location.longitude}`);
        }

    });

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.otpp) {
            const location = doc.data().location as GeoPoint;
            const locationString = `${location.latitude},${location.longitude}`;
            if (!visitedLocations.has(locationString)) {
                Data.undiscover.push(location);
            }
        }
    });

    return Data;
};

export default (app: ElysiaApp) => app
    .put("/getbyid", getInfoHandler, {
        body: GetByIdBodySchema
    })
    .put("/mapbyid", getMapInfoHandler, {
        body: GetMyMaps
    });