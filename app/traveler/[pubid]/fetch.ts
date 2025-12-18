import axios from "axios";
import { server } from "@/app/config.json"

export default async function fetchData(uid: string) {
    const decodedUid = decodeURIComponent(uid);
    try {
        const response = await axios.get(`${server}/user/public`, {
            headers: {
                aetheruid: decodedUid
            }
        });
        return response.data;
    } catch {
        return "error";
    }
}