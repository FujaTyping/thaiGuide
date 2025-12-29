import type { ElysiaApp } from "../../index";
import { t } from "elysia";
import ai from "../../lib/geminiModel";
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit';
import db from "../../lib/firebase";
import { collection, doc, getDoc, getDocs, setDoc, serverTimestamp } from "firebase/firestore";
import {gmn_model} from "../../config.json";

const QuizGenSchema = z.object({
    quizTitle: z.string().describe('The title of the quiz'),
    province: z.string().describe('The province the quiz is about'),
    questions: z.array(z.object({
        questionText: z.string().describe('The text of the question'),
        choices: z.array(z.object({
            text: z.string().describe('The text of the choice'),
            isCorrect: z.boolean().describe('Whether this choice is correct')
        })).describe('List of choices for the question')
    })).describe('List of questions for the quiz')
});

const QuizRequestSchema = t.Object({
    province: t.String()
});

const QuizCheckSchema = {
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
        const { output } = await ai.generate({
            model: googleAI.model(gmn_model),
            prompt: `
                You are an intelligent quiz generator.

                Please generate a quiz about the province of ${province} in Thailand.
                The quiz should have a random number of questions, between 2 and 5 (inclusive).
                Each question must have exactly two choices, with one choice being correct and the other incorrect.

                Guidelines:
                - No same choices like (Golden mermaid and The Golden Mermaid)
                - Ensure the number of questions is randomly between 2 and 5.
                - Each question must have exactly two choices or more.
                - For each question, one choice must be marked true for "isCorrect" and the other false.
                - The "province" field in the JSON output should be the same as the input province.
                - The "quizTitle" should be engaging and mention the province.
                - Questions should be relevant to the specified province (e.g., landmarks, culture, history, geography).
                - Make the quiz challenging
            `,
            output: { schema: QuizGenSchema }
        });

        return {...output,model: gmn_model};

    } catch (error) {
        console.error("Error in generateQuizHandler:", error);
        set.status = 500;
        return { error: "An error occurred while generating the quiz." };
    }
};

const checkQuizCompletionHandler = async ({ params: { name }, headers, set }: { params: { name: string }, headers: typeof QuizCheckSchema.headers.static, set: { status: number | string } }) => {
    const quizName = name;
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
    .get("/check/:name", checkQuizCompletionHandler, QuizCheckSchema)
    .get("/getbyuser", getQuizHandler, QuizUserSchema);