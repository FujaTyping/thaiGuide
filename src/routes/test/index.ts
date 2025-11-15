import type { ElysiaApp } from "../../index";

function testCode() {
    return {
        "name": "Test QrCode",
        "province": "songkhla",
        "otpp": false,
        "points": 1,
        "location": {
            "latitude": 0,
            "longitude": 0
        },
        "samespot": false,
        "badge": {
            "province": "songkhla",
            "imageUrl": "https://ik.imagekit.io/61sqw5prw/thaiGuide/badge/songkhla?updatedAt=1760080419323",
            "slogan": "Birds a delight to see, Samila a delight to the heart, a large city of two seas, charm of the Tin Bridge, the southern business center",
            "recivedAt": {
                "_methodName": "serverTimestamp"
            }
        },
        "reciveNewBadge": true,
        "streakYRS": 1,
        "streak": 1
    }
}

export default (app: ElysiaApp) => app
    .get("/code", testCode);