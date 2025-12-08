import moment from "moment";
import { getDocs, collection, DocumentData, deleteDoc, doc } from "firebase/firestore";
import client from "../lib/imagekit";
import db from "../lib/firebase";
import sendHooks from "../lib/logsSend";

async function eventCycle() {
    let broad = { all: 0, delete: 0, remain: 0 };
    const querySnapshot = await getDocs(collection(db, "event"));
    querySnapshot.forEach(async (docItem) => {
        const data: DocumentData = docItem.data();
        broad.all++;
        if (moment.unix(data.due.seconds).isBefore()) {
            await deleteDoc(doc(db, "event", docItem.id));
            await client.files.delete(data.fileId);
            broad.delete++;
        }
    });
    broad.remain = broad.all - broad.delete;
    let payload;
    if (broad.delete != 0) {
        payload = {
            "content": "**📌 Important Notice** ||@here ||",
            "embeds": [
                {
                    "author": {
                        "name": "ThaiGuide Backend",
                        "icon_url": "https://www.thaiguide.in.th/icon-512x512.png"
                    },
                    "color": 16217098,
                    "title": "🗃️ EventCycle | Cron job report!",
                    "description": `Job has successfully done at ${moment().format('MMMM Do YYYY, h:mm:ss a')}`,
                    "fields": [
                        {
                            "name": "All Object",
                            "value": `${broad.all} Items`,
                            "inline": true
                        },
                        {
                            "name": "Removed Object",
                            "value": `${broad.delete} Items`,
                            "inline": true
                        },
                        {
                            "name": "Remain Object",
                            "value": `${broad.remain} Items`,
                            "inline": true
                        }
                    ]
                }
            ],
            "attachments": []
        }
    }
    await sendHooks({ data: payload });
}

export default eventCycle;