import axios from "axios";
import { server } from "../config.json"

interface resBody {
    method?: string
    path: string
    body?: any
}

async function apiCall({
    method = 'GET', path, body = {}
}: resBody) {
    switch (method) {
        case 'PUT':
            const resPUT = await axios.put(`http://${server}${path}`, body);
            return resPUT.status;
        default :
            const resGET = await axios.get(`http://${server}${path}`);
            return resGET.status;
    }
}

export default apiCall;