import { t } from "elysia";
import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const GetByIdBodySchema = {
    headers: t.Object({
        aetheruid: t.String()
    })
}

const getBanner = async ({ headers, set }: { headers: typeof GetByIdBodySchema.headers.static, set: { status: number | string } }) => {
    const uid = headers.aetheruid;
    try {
        let Rbanners: any[] = [];

        const bannerCollectionRef = collection(db, "customize", 'user', 'banner');
        const q = query(bannerCollectionRef, where("redeemOnly", "!=", true));
        const bannersSnapshot = await getDocs(q);

        const UbannerCollectionRef = collection(db, "Users", uid, 'inventory');
        const Uq = query(UbannerCollectionRef, where("type", "==", "background"));
        const UbannersSnapshot = await getDocs(Uq);

        if (!bannersSnapshot.empty) {
            bannersSnapshot.docs.map(doc => Rbanners.push({
                ...doc.data()
            }));
        }

        if (!bannersSnapshot.empty) {
            UbannersSnapshot.docs.map(doc => Rbanners.push({
                ...doc.data(),
                from: "redeem"
            }));
        }

        set.status = 200;
        return { banners: Rbanners };
    } catch (error) {
        console.error("Failed to fetch banner:", error);
        set.status = 500;
        return { error: "Failed to process banner request" };
    }
};

export default (app: ElysiaApp) => app
    .get("/banner", getBanner, GetByIdBodySchema)