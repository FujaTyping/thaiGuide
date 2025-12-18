import axios from "axios";
import { server } from "@/app/config.json"

export default async function fetchData(id: string) {
    try {
        const response = await axios.get(`${server}/roadtrip/getbyid/${id}`);
        return response.data;
    } catch {
        return "error";
    }
}