import { ComposeEventHandler, defineCompose } from "endpoint-kit";
import { H3Event } from "h3";
import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});
export const defineAI = (opt: {
    getPrompt: (event: H3Event) => string
    getSystem?: (event: H3Event) => string
}): ComposeEventHandler => async (event) => {
    const { getPrompt, getSystem } = opt;
    const prompt = getPrompt(event);
    const system = getSystem?.(event) || '你是一个 985 毕业的高级人才，责任心强，能力高超，你会根据要求以最高标准完成任务，这是你工作的内容。你工作的时候会总结字段并输出 JSON 字符串，不要输出其它无关内容';
    const completion =await  openai.chat.completions.create({
        model: "qwen-plus",
        messages: [
            { role: "system", content: system },
            { role: "user", content: prompt }
        ],
        response_format: { "type": "json_object" }
    });
    return completion.choices[0].message.content
}