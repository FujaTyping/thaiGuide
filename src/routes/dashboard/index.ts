import { t } from "elysia";
import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";
import { collection, getCountFromServer } from "firebase/firestore";

const getOverview = async ({ set }: { set: { status: number | string } }) => {
    const collectionsToCount = ['activities', 'restaurant', 'roadtrip', 'Users'];

    const countPromises = collectionsToCount.map(async (item) => {
        const countQuerySnapshot = await getCountFromServer(collection(db, item));
        return [item, countQuerySnapshot.data().count] as const;
    });

    const counts = await Promise.all(countPromises);

    return Object.fromEntries(counts);
};

export default (app: ElysiaApp) => app
    .get("/overview", getOverview)