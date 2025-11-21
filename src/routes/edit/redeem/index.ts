import { t } from "elysia";
import type { ElysiaApp } from "../../../index";
import db from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const getProduct = async ({ set }: { set: { status: number | string } }) => {
    try {
        let data: any = [];
        const querySnapshot = await getDocs(collection(db, "redeem"));
        querySnapshot.forEach((doc) => {
            const resd = doc.data();
            data.push({
                id: doc.id,
                ...resd
            })
        });
        return data;
    } catch (error) {
        console.error("Failed to get all code:", error);
        set.status = 500;
        return { error: "Failed to get all code" };
    }
};

export default (app: ElysiaApp) => app
    .get("/getall", getProduct)