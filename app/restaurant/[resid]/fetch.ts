import tgFetch from "@/lib/fetch";
import { server } from "@/app/config.json"

export default async function fetchData(id: string) {
    try {
        const response = await tgFetch({ url: `${server}/restaurant/getbyid/${id}` });
        return response.data;
    } catch {
        return "error";
    }
}