import type { ElysiaApp } from "../../index";
import { t } from "elysia";
import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';
import db from "../../lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

const ai = genkit({
    plugins: [googleAI()],
    model: gemini20Flash,
});

const QuizRequestSchema = t.Object({
    province: t.String()
});

const QuizCompletionCheckSchema = t.Object({
    userId: t.String(),
    province: t.String()
});

const generateQuizHandler = async ({ body, set }: { body: typeof QuizRequestSchema.static, set: { status: number | string } }) => {
    const { province } = body;

    try {
        const quizGenerationFlow = ai.defineFlow('quizGenerationFlow', async ({ province }: { province: string }) => {
            const promptContent = `
                You are an intelligent quiz generator.

                Please generate a quiz about the province of ${province} in Thailand.
                The quiz should have a random number of questions, between 2 and 5 (inclusive).
                Each question must have exactly two choices, with one choice being correct and the other incorrect.

                Return the response in this exact JSON format:

                {
                  "quizTitle": "string", // e.g., "Fun Quiz about ${province}"
                  "province": "${province}", // The province the quiz is about
                  "questions": [
                    {
                      "questionText": "string", // The text of the question
                      "choices": [
                        { "text": "string", "isCorrect": boolean }, // First choice
                        { "text": "string", "isCorrect": boolean }  // Second choice
                      ]
                    }
                    // ... (repeat for a total of 2 to 5 questions)
                  ]
                }

                Guidelines:
                - Ensure the number of questions is randomly between 2 and 5.
                - Each question must have exactly two choices.
                - For each question, one choice must be marked true for "isCorrect" and the other false.
                - The "province" field in the JSON output should be the same as the input province.
                - The "quizTitle" should be engaging and mention the province.
                - Questions should be relevant to the specified province (e.g., landmarks, culture, history, geography).
                - Return valid JSON only, no markdown or extra text.
            `;

            const response = await ai.generate({
                prompt: promptContent,
                output: { format: 'json' }
            });

            const jsonString = response.message?.content[0].text;

            if (!jsonString) {
                console.error("AI response was empty or did not contain text.");
                throw new Error("Failed to generate quiz: AI returned no content.");
            }

            try {
                return JSON.parse(jsonString);
            } catch (parseError) {
                console.error("Failed to parse AI response as JSON:", parseError, "Response:", jsonString);
                throw new Error("Failed to generate quiz: AI returned invalid JSON.");
            }
        });

        const quizData = await quizGenerationFlow({ province });
        return quizData;

    } catch (error) {
        console.error("Error in generateQuizHandler:", error);
        set.status = 500;
        return { error: "An error occurred while generating the quiz." };
    }
};

const checkQuizCompletionHandler = async ({ body, set }: { body: typeof QuizCompletionCheckSchema.static, set: { status: number | string } }) => {
    const { userId, province } = body;

    if (!userId || !province) {
        set.status = 400;
        return { error: "userId and province are required." };
    }

    try {
        const completionsRef = collection(db, "userQuizCompletions");
        const q = query(
            completionsRef,
            where("userId", "==", userId),
            where("province", "==", province),
            limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            set.status = 200;
            return {
                userId,
                province,
                hasCompleted: true,
            };
        } else {
            set.status = 200;
            return {
                userId,
                province,
                hasCompleted: false
            };
        }
    } catch (error) {
        console.error("Error checking quiz completion:", error);
        set.status = 500;
        return { error: "An error occurred while checking quiz completion." };
    }
};

export default (app: ElysiaApp) => app
    .post("/gen", generateQuizHandler, {
        body: QuizRequestSchema
    })
    .put("/check", checkQuizCompletionHandler, {
        body: QuizCompletionCheckSchema
    });