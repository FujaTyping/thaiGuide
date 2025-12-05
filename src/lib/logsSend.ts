import 'dotenv/config';
import axios from 'axios';

const endpoint = process.env.DSGHOOKS as string;

async function sendHooks({ data }: { data: any }) {
    try {
        await axios.post(endpoint, data);
    } catch (e: any) {
        console.log(`Can't send logs via hooks : ${e.message}`)
    }
}

export default sendHooks;