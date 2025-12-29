import type { ElysiaApp } from "../../index";
import { t } from "elysia";
import ai from "../../lib/geminiModel";
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit';
import { gmn_model } from "../../config.json";

const GetByIdBodySchema = t.Object({
    message: t.String(),
    duration: t.String(),
    type: t.String(),
    tag: t.String()
});

const TripSchema = z.object({
    tripTitle: z.string().describe('The title of the trip'),
    description: z.string().describe('A brief description of the trip'),
    days: z.array(z.object({
        day: z.number().describe('The day number'),
        location: z.string().describe('The location for this day'),
        activities: z.array(z.object({
            time: z.string().describe('Time of day (Morning | Afternoon | Evening)'),
            title: z.string().describe('Title of the activity'),
            description: z.string().describe('Description of the activity'),
        })),
        foodRecommendations: z.array(z.string()).describe('List of food recommendations'),
        tips: z.string().describe('Tips for the day'),
        travelNotes: z.string().optional().describe('Travel notes'),
    })),
});

const getInfoHandler = async ({ body, set }: { body: typeof GetByIdBodySchema.static, set: { status: number | string } }) => {
    const { message, duration, type, tag } = body;

    try {
        const { output } = await ai.generate({
            model: googleAI.model(gmn_model),
            prompt: `
                You are a smart and friendly travel assistant for a tourism app called "ThaiGuide".

                Please generate a detailed travel itinerary in Thailand based on the following inputs:

                - User want : ${message || "user dosn't provide any message"} (the response follow the language of the user want)
                - Trip duration: ${duration}
                - Trip type: ${type} (e.g., family, adventure, romantic, cultural, food tour)
                - Interests/tags: ${tag} (e.g., temples, street food, beaches, mountains, hidden gems)

                Guidelines:
                - Detect the language of the user's input ("User want") and generate the response in that same language. If the user types in Thai, respond in Thai. If the user types in Japanese, respond in Japanese.
                - Make the itinerary vivid, culturally rich, and tailored to the trip type and interests.
                - For food tours, include more street food.
                - For family, highlight safe and fun places for kids.
                - For romantic, focus on views and quiet activities.
                - Suggest lesser-known places if "hidden gems" is a tag.
                - Use natural-sounding names and diverse locations across Thailand.
            `,
            output: { schema: TripSchema }
        });

        return { ...output, model: gmn_model };

    } catch (error) {
        set.status = 500;
        return { error: "An error occurred while fetching the document." };
    }
};

export default (app: ElysiaApp) => app.post("/gen", getInfoHandler, {
    body: GetByIdBodySchema
});