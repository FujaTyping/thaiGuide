import type { ElysiaApp } from "../../index";
import { t } from "elysia";
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

const ai = genkit({
    plugins: [googleAI()],
    model: gemini15Flash,
});

const GetByIdBodySchema = t.Object({
    duration: t.String(),
    type: t.String(),
    tag: t.String()
});

const getInfoHandler = async ({ body, set }: { body: typeof GetByIdBodySchema.static, set: { status: number | string } }) => {
    const { duration, type, tag } = body;

    try {
        const genTrip = ai.defineFlow('tripFlow', async ({ duration, type, tag }) => {
            const promptContent = `
                You are a smart and friendly travel assistant for a tourism app called "ThaiGuide".

                Please generate a detailed travel itinerary in Thailand based on the following inputs:

                - Trip duration: ${duration}
                - Trip type: ${type} (e.g., family, adventure, romantic, cultural, food tour)
                - Interests/tags: ${tag} (e.g., temples, street food, beaches, mountains, hidden gems)

                Return the response in this exact JSON format:

                {
                "tripTitle": "string",
                "description": "string",
                "days": [
                    {
                    "day": 1,
                    "location": "string",
                    "activities": [
                        {
                        "time": "Morning | Afternoon | Evening",
                        "title": "string",
                        "description": "string"
                        },
                        {
                        "time": "Afternoon",
                        "title": "string",
                        "description": "string"
                        }
                    ],
                    "foodRecommendations": [
                        "string", // optional local dishes or restaurants
                        "string"
                    ],
                    "tips": "string", // travel tips for this day
                    "travelNotes": "string" // optional notes like expected time between locations or what to bring
                    }
                ]
                }

                Guidelines:
                - Return valid JSON only, no markdown or extra text.
                - Make the itinerary vivid, culturally rich, and tailored to the trip type and interests.
                - For food tours, include more street food.
                - For family, highlight safe and fun places for kids.
                - For romantic, focus on views and quiet activities.
                - Suggest lesser-known places if "hidden gems" is a tag.
                - Use natural-sounding names and diverse locations across Thailand.
            `;

            const response = await ai.generate({
                prompt: promptContent,
                output: { format: 'json' }
            });

            const jsonString = response.message?.content[0].text;

            if (!jsonString) {
                console.error("AI response was empty or did not contain text.");
                throw new Error("Failed to generate trip itinerary: AI returned no content.");
            }
            return jsonString;
        });

        return genTrip({ duration, type, tag });

    } catch (error) {
        set.status = 500;
        return { error: "An error occurred while fetching the document." };
    }
};

export default (app: ElysiaApp) => app.post("/gen", getInfoHandler, {
    body: GetByIdBodySchema
});