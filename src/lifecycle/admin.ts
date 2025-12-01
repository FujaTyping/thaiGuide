import 'dotenv/config';
import { doc, getDoc } from 'firebase/firestore';
import jwt from 'jsonwebtoken';
import db from '../lib/firebase';

const RAND = process.env.JWT_RAND as string;

interface decodeObject {
    uid: string
}

async function validateAdmin({ token }: { token: string }): Promise<boolean> {
    try {
        const decode = jwt.verify(token, RAND) as decodeObject;

        const docRef = doc(db, "Users", decode.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().role == "admin") {
            return true;
        }
        return false;
    } catch {
        return false;
    }
}

export default validateAdmin;