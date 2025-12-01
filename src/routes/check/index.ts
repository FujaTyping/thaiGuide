import { t } from "elysia";
import type { ElysiaApp } from "../../index";
import db from "../../lib/firebase";
import 'dotenv/config';
import { doc, getDoc } from "firebase/firestore";
import jwt from 'jsonwebtoken';

const RAND = process.env.JWT_RAND as string;

const checkUser = {
    headers: t.Object({
        aetheruid: t.String()
    }),
    body: t.Object({
        email: t.String()
    })
}

async function checkUS({ headers, body, set }: { body: typeof checkUser.body.static, headers: typeof checkUser.headers.static, set: { status: number } }) {
    const uid = headers.aetheruid;
    const { email } = body;

    const docRef = doc(db, "Users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const token = jwt.sign({
            name: data.name,
            email,
            uid
        }, RAND);

        set.status = 200;
        return {
            name: data.name,
            email,
            token
        };
    } else {
        set.status = 404;
        return 'No user found!'
    }
}

export default (app: ElysiaApp) => app
    .put('/perms', checkUS, checkUser);
