import type { ElysiaApp } from "../../index";
import { t } from "elysia";
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.TYPHOON_APIKEY,
    baseURL: 'https://api.opentyphoon.ai/v1',
});

const ChatBodySchema = t.Object({
    message: t.String(),
});

const getInfoHandler = async ({ body, set }: { body: typeof ChatBodySchema.static, set: { status: number | string } }) => {
    const { message } = body;

    try {
        const stream = await openai.chat.completions.create({
            model: 'typhoon-v2.1-12b-instruct',
            messages: [
                { role: "system", content: "You are a friendly and knowledgeable AI companion specializing in travel and tourism in Thailand. Your goal is to assist users in planning their dream trips to Thailand by providing insightful advice, recommendations, and information. You should be able to answer questions about popular destinations, hidden gems, cultural etiquette, transportation, accommodation, local cuisine, activities, safety tips, and visa requirements. Strive to offer personalized suggestions based on user preferences, such as budget, travel style (e.g., adventure, relaxation, cultural immersion), and interests (e.g., history, nature, nightlife). Be enthusiastic and encouraging, making users excited about their upcoming journey to the Land of Smiles." },
                { role: 'user', content: message }
            ],
            stream: true,
        });

        let Message = "";
        for await (const chunk of stream) {
            Message += (chunk.choices[0]?.delta?.content || '');
        }

        set.status = 200;
        return Message;
    } catch (error) {
        set.status = 500;
        return { error: "An error occurred while generate content" };
    }
};

export default (app: ElysiaApp) => app.post("/gen", getInfoHandler, {
    body: ChatBodySchema
});