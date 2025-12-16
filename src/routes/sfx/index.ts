import type { ElysiaApp } from "../../index";

async function getSongbyQuery({ params, set }: { params: { name: string }, set: any }) {
    const { name } = params;
    const audio = Bun.file(`./data/wav/${name}.wav`);
    if (await audio.exists()) {
        set.headers['Content-Type'] = 'audio/wav';
        return audio;
    }
    set.status = 400;
    return "Can't find that music";
}

export default (app: ElysiaApp) => app
    .get("/:name", getSongbyQuery);