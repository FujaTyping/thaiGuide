import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const getBanner = async ({ set }: { set: { status: number | string } }) => {
    try {
        const bannerCollectionRef = collection(db, "customize", 'user', 'banner');
        const bannersSnapshot = await getDocs(bannerCollectionRef);

        if (!bannersSnapshot.empty) {
            const banners = bannersSnapshot.docs.map(doc => ({
                ...doc.data()
            }));
            set.status = 200;
            return { banners };
        } else {
            return {
                banners: []
            };
        }
    } catch (error) {
        console.error("Failed to fetch banner:", error);
        set.status = 500;
        return { error: "Failed to process banner request" };
    }
};

export default (app: ElysiaApp) => app
    .get("/banner", getBanner)