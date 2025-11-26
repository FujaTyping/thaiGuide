import type { ElysiaApp } from "../../index";

function testCode() {
    return {
        "name": "TEST QR",
        "province": "songkhla",
        "location": {
            "latitude": 0,
            "longitude": 0
        },
        "points": "1",
        "originalpoint": "1",
        "samespot": false,
        "lv": 1,
        "exp": "1",
        "nextexp": 50,
        "expearn": "1",
        "streakYRS": 2025,
        "streak": 1,
        "otpp": false
    }
}

export default (app: ElysiaApp) => app
    .get("/code", testCode);