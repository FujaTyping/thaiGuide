import OpenAI from 'openai';
import "dotenv/config";

const TYP_K = process.env.TYPHOON_APIKEY

const OpenTyphoon = new OpenAI({
    apiKey: TYP_K,
    baseURL: 'https://api.opentyphoon.ai/v1',
});

export default OpenTyphoon;