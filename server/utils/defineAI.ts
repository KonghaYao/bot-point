import { ComposeEventHandler, defineCompose } from "endpoint-kit";
import { H3Event } from "h3";
import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE_URL,
});
export const defineAI = (opt: {
    getPrompt: (event: H3Event) => string
    getSystem?: (event: H3Event) => string
}): ComposeEventHandler => async (event) => {
    const { getPrompt, getSystem } = opt;
    const prompt = getPrompt(event);
    const system = getSystem?.(event) || 'You are a helpful assistant.';
    const completion = openai.chat.completions.create({
        model: "qwen-plus",
        messages: [
            { role: "system", content: system },
            { role: "user", content: prompt }
        ],
    });
    return completion.asResponse()
}