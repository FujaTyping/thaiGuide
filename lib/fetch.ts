import axios from "axios";

interface objectSchema {
    url: string;
    data?: any;
    cache?: boolean
}

async function tgFetch({ url, data = {}, cache = false }: objectSchema) {
    const option = cache ? { next: { revalidate: 600 } } : { cache: "no-store" }
    const response = await axios.get(url, {
        ...data,
        adapter: "fetch",
        fetchOptions: option
    });
    return response;
}

export default tgFetch;