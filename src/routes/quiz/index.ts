import type { ElysiaApp } from "../../index";
import { t } from "elysia";
import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';
import db from "../../lib/firebase";
import { collection, doc, getDoc, getDocs, setDoc, serverTimestamp } from "firebase/firestore";

const ai = genkit({
    plugins: [googleAI()],
    model: gemini20Flash,
});

const QuizRequestSchema = t.Object({
    province: t.String()
});

const QuizCheckSchema = {
    body: t.Object({
        quizName: t.String()
    }),
    headers: t.Object({
        aetheruid: t.String()
    })
}

const QuizUserSchema = {
    headers: t.Object({
        aetheruid: t.String()
    })
};

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
                - No same choices like (Golden mermaid and The Golden Mermaid)
                - Ensure the number of questions is randomly between 2 and 5.
                - Each question must have exactly two choices or more.
                - For each question, one choice must be marked true for "isCorrect" and the other false.
                - The "province" field in the JSON output should be the same as the input province.
                - The "quizTitle" should be engaging and mention the province.
                - Questions should be relevant to the specified province (e.g., landmarks, culture, history, geography).
                - Make the quiz challenging
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

const checkQuizCompletionHandler = async ({ body, headers, set }: { body: typeof QuizCheckSchema.body.static, headers: typeof QuizCheckSchema.headers.static, set: { status: number | string } }) => {
    const { quizName } = body;
    const userId = headers.aetheruid;

    if (!userId || !quizName) {
        set.status = 400;
        return { error: "userId and quizName are required." };
    }

    try {
        const completionDocRef = doc(db, "Users", userId, "quiz", quizName);
        const docSnap = await getDoc(completionDocRef);

        if (docSnap.exists()) {
            set.status = 409;
            return { error: `You have already responded to the quiz for ${quizName}.` };
        } else {
            await setDoc(completionDocRef, {
                completedAt: serverTimestamp(),
            });
            set.status = 201;
            return {
                message: `Quiz participation for ${quizName} recorded successfully.`,
            };
        }
    } catch (error) {
        console.error("Error in quiz completion check/record:", error);
        set.status = 500;
        return { error: "An error occurred while processing quiz completion." };
    }
};

const getQuizHandler = async ({ headers, set }: { headers: typeof QuizUserSchema.headers.static, set: { status: number | string } }) => {
    const userId = headers.aetheruid;

    if (!userId) {
        set.status = 400;
        return { error: "userId is required." };
    }

    try {
        const userQuizzesCollectionRef = collection(db, "Users", userId, "quiz");
        const querySnapshot = await getDocs(userQuizzesCollectionRef);

        if (querySnapshot.empty) {
            set.status = 404;
            return {
                message: "No quizzes found for this user.",
                completedQuizzes: []
            };
        }

        const completedQuizzes = querySnapshot.docs.map(doc => {
            return {
                quizName: doc.id,
                ...doc.data()
            };
        });

        return { completedQuizzes };

    } catch (error) {
        console.error("Error fetching user quizzes:", error);
        set.status = 500;
        return { error: "An error occurred while fetching user quizzes." };
    }
};

export default (app: ElysiaApp) => app
    .post("/gen", generateQuizHandler, {
        body: QuizRequestSchema
    })
    .put("/check", checkQuizCompletionHandler, QuizCheckSchema)
    .put("/getbyuser", getQuizHandler, QuizUserSchema);