import 'dotenv/config';
import { doc, getDoc } from 'firebase/firestore';
import jwt from 'jsonwebtoken';
import db from '../lib/firebase';

const RAND = process.env.JWT_RAND as string;

interface decodeObject {
    uid: string
}

function validateAdmin({ token }: { token: string }) {
    jwt.verify(token, RAND, async (err, decode: decodeObject) => {
        if (err) {
            return false;
        }
        const docRef = doc(db, "Users", decode.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().role == "admin") {
            return true;
        }
        return false;
    });
}

export default validateAdmin;