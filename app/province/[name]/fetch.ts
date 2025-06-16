import axios from "axios";
import { server } from "@/app/config.json"

export default async function fetchData(id: string) {
    try {
        const response = await axios.put(`https://${server}/province/getbyname`, {
            name: id
        });
        return response.data;
    } catch {
        return "error";
    }
}