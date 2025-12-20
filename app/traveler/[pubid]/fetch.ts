import tgFetch from "@/lib/fetch";
import { server } from "@/app/config.json"

export default async function fetchData(uid: string) {
    const decodedUid = decodeURIComponent(uid);
    try {
        const response = await tgFetch({
            url: `${server}/user/public`, data: {
                headers: {
                    aetheruid: decodedUid
                }
            }
        })
        return response.data;
    } catch {
        return "error";
    }
}