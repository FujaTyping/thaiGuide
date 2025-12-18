import type { ElysiaApp } from "../../index";
import { collection, getDocs, DocumentData, doc, getDoc, QueryDocumentSnapshot } from "firebase/firestore";
import db from "../../lib/firebase";
import { t } from "elysia";

const getIdInfoHandler = async ({ params: { name }, set }: { params: { name: string }, set: { status: number | string } }) => {
    const docId = name;
    const docRef = doc(db, "provinces", docId);

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const responseData = docSnap.data();
            let softpowerData: DocumentData[] = [];
            let socialData: DocumentData[] = [];


            const softpowerColRef = collection(docRef, "softpower");
            const softpowerSnapshot = await getDocs(softpowerColRef);

            if (!softpowerSnapshot.empty) {
                softpowerData = softpowerSnapshot.docs.map((subDoc: QueryDocumentSnapshot<DocumentData>) => ({
                    name: subDoc.id,
                    ...subDoc.data()
                }));
            }

            const socialColRef = collection(docRef, "social");
            const socialSnapshot = await getDocs(socialColRef);

            if (!socialSnapshot.empty) {
                socialData = socialSnapshot.docs.map((subDoc: QueryDocumentSnapshot<DocumentData>) => ({
                    name: subDoc.id,
                    ...subDoc.data()
                }));
            }

            set.status = 200;
            return { ...responseData, softpower: softpowerData, social: socialData };
        } else {
            set.status = 404;
            return { message: "No data found" };
        }
    } catch (error) {
        console.error("Error fetching document by name:", error);
        set.status = 500;
        return { error: "An error occurred while fetching the document." };
    }
};

export default (app: ElysiaApp) => app
    .get("/getbyname/:name", getIdInfoHandler);