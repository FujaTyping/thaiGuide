import type { ElysiaApp } from "../../index";
import { t } from "elysia";
import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

const ai = genkit({
    plugins: [googleAI()],
    model: gemini20Flash,
});

const GetByIdBodySchema = t.Object({
    message: t.String(),
    duration: t.String(),
    type: t.String(),
    tag: t.String()
});

const getInfoHandler = async ({ body, set }: { body: typeof GetByIdBodySchema.static, set: { status: number | string } }) => {
    const { message, duration, type, tag } = body;

    try {
        const genTrip = ai.defineFlow('tripFlow', async ({ message, duration, type, tag }) => {
            const promptContent = `
                You are a smart and friendly travel assistant for a tourism app called "ThaiGuide".

                Please generate a detailed travel itinerary in Thailand based on the following inputs:

                - User want : ${message || "user dosn't provide any message"} (the response follow the language of the user want)
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
                        "description": "string",
                        "image": "string", // Image URL for the activity
                        "googleMapsLink": "string" // Google Maps link for the activity
                        },
                        {
                        "time": "Afternoon",
                        "title": "string",
                        "description": "string",
                        "image": "string", // Image URL for the activity
                        "googleMapsLink": "string" // Google Maps link for the activity
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
                - Provide real, publicly accessible image URLs for activities (e.g., from Unsplash, Pexels, Wikimedia Commons, or official tourism sites). Avoid placeholder URLs or images requiring logins.
                - Provide direct, functional Google Maps links for specific activity locations. These links should open directly to the location on Google Maps.
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

        return genTrip({ message, duration, type, tag });

    } catch (error) {
        set.status = 500;
        return { error: "An error occurred while fetching the document." };
    }
};

export default (app: ElysiaApp) => app.post("/gen", getInfoHandler, {
    body: GetByIdBodySchema
});