import axios from "axios";

interface objectSchema {
    url: string;
    data?: any
}

async function tgFetch({ url, data = {} }: objectSchema) {
    const response = await axios.get(url, {
        ...data,
        adapter: "fetch",
        fetchOptions: { cache: "force-cache" }
    });
    return response;
}

export default tgFetch;