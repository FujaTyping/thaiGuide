import type { ElysiaApp } from "../../../index";
import { t } from "elysia"
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import QRCode from 'qrcode'
import db from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { wrapText } from "../../../lib/canvas";

GlobalFonts.registerFromPath('./data/firaCode.ttf', 'Firacode')
GlobalFonts.registerFromPath('./data/firacode-bold.ttf', 'Firacode Bold')

const transactionDetails = {
    body: t.Object({
        id: t.String(),
        email: t.String()
    }),
    headers: t.Object({
        aetheruid: t.String()
    })
}

async function createNew({ body, set, headers }: { headers: typeof transactionDetails.headers.static, body: typeof transactionDetails.body.static, set: any }) {
    const { id, email } = body;
    const uid = headers.aetheruid;

    try {
        const docRef = doc(db, "Users", uid, "transactions", id);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        console.log(data);

        const docImage = await loadImage('./data/RTemplateRedeem.png');
        const canvas = createCanvas(docImage.width, docImage.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(docImage, 0, 0, docImage.width, docImage.height);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#000';

        ctx.font = '30px Firacode';
        ctx.fillText(new Date(data?.timestamp.toDate()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), docImage.width - 405, (docImage.height / 2) - 525);

        ctx.fillStyle = '#000';

        ctx.font = '50px Firacode Bold';
        const placeMaxWidth = (docImage.width / 2) - 50;
        const placeLineHeight = 60;
        await wrapText(ctx, data?.place || '', 240, (docImage.height / 2) - 230, placeMaxWidth, placeLineHeight);

        ctx.fillText(data?.point.slice(1), (docImage.width / 2) + 200, (docImage.height / 2) - 230);

        ctx.font = '50px Firacode';
        ctx.fillText(data?.point.slice(1), (docImage.width / 2) + 200, (docImage.height / 2) + 70);

        ctx.font = '50px Firacode Bold';
        ctx.fillText(data?.point.slice(1), (docImage.width / 2) + 200, (docImage.height / 2) + 265);

        ctx.font = '30px Firacode Bold';
        ctx.fillText(email, (docImage.width / 2) - 150, docImage.height - 310);

        ctx.font = '30px Firacode';
        ctx.fillText(btoa(uid), (docImage.width / 2) - 300, docImage.height - 220);

        if (data?.idRedeem) {
            const redImage = await loadImage('./data/Redeemed.png');
            ctx.drawImage(redImage, (docImage.width / 2) - 50, (docImage.height / 2) + 310, redImage.width - 50, redImage.height - 20);
        } else {
            const url = await QRCode.toDataURL(`${uid}-${id}`, {
                width: 390,
                color: {
                    dark: "#f7740a",
                    light: "f4f2f4"
                },
                type: 'image/png',
            });
            const qrImage = await loadImage(url);
            ctx.drawImage(qrImage, 180, (docImage.height / 2) + 245, qrImage.width, qrImage.height);
        }

        set.headers['Content-Type'] = 'image/png';

        const pngData = await canvas.toBuffer('image/png');
        return pngData;
    } catch (e) {
        console.log(e)
    }
}

export default (app: ElysiaApp) => app
    .post("/", createNew, transactionDetails);