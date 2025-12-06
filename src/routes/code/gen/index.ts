import type { ElysiaApp } from "../../../index";
import { t } from "elysia"
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import QRCode from 'qrcode'
import { wrapText } from "../../../lib/canvas";

GlobalFonts.registerFromPath('./data/canva-sans-bold.otf', 'Canva Sans Bold')

const generateCodeDoc = {
    body: t.Object({
        id: t.String(),
        name: t.String(),
        ot: t.Boolean()
    })
}

async function createNew({ body, set }: { body: typeof generateCodeDoc.body.static, set: any }) {
    const { id, ot, name } = body;

    const docImage = await loadImage('./data/TemplateQR.png');
    const canvas = createCanvas(docImage.width, docImage.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(docImage, 0, 0, docImage.width, docImage.height);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFF';

    ctx.font = '90px Canva Sans Bold';
    const maxWidth = docImage.width - 300;
    const lineHeight = 90;
    const x = (docImage.width / 2) + 25;
    await wrapText(ctx, name, x, docImage.height / 2 - 530, maxWidth, lineHeight, true);

    try {
        const url = await QRCode.toDataURL(id, {
            width: 720,
            color: {
                dark: "#f7740a",
                light: "#FFf"
            },
            type: 'image/png',
        });
        const qrImage = await loadImage(url);
        ctx.drawImage(qrImage, (docImage.width / 4) + 20, (docImage.height - qrImage.height) / 2, qrImage.width, qrImage.height);
    } catch (err) {
        console.error(err);
    }

    if (ot) {
        const otImage = await loadImage('./data/QROTU.png');
        ctx.drawImage(otImage, 70, (docImage.height / 2) + 450, otImage.width, otImage.height);
    } else {
        const otImage = await loadImage('./data/SCM.png');
        ctx.drawImage(otImage, (otImage.width / 2) - 10, (docImage.height / 2) + 440, otImage.width, otImage.height);
    }

    const pngData = await canvas.toBuffer('image/png');
    set.headers['Content-Type'] = 'image/png';
    set.status = 200;

    return pngData;
}

export default (app: ElysiaApp) => app
    .post("/", createNew, generateCodeDoc);