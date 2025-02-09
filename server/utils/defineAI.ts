import { ComposeEventHandler, defineCompose } from "endpoint-kit";
import { H3Event } from "h3";
import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: useRuntimeConfig().NITRO_OPENAI_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

/**
 * ?stream=true 则使用流模式，默认为 json 输出
 * @param opt
 * @returns
 */
export const defineAI =
    (opt: {
        getPrompt: (event: H3Event, isStream: boolean) => string;
        getSystem?: (event: H3Event, isStream: boolean) => string;
    }): ComposeEventHandler =>
    async (event) => {
        const { getPrompt, getSystem } = opt;
        const stream = !!getQuery(event).stream;
        const prompt = getPrompt(event, stream);
        const system =
            getSystem?.(event, stream) ||
            `你是一个 985 毕业的高级人才，责任心强，能力高超，你会根据要求以最高标准完成任务，这是你工作的内容。${
                !stream
                    ? "你工作的时候会总结字段并输出 JSON 字符串，如无特殊字段，回复到 content 字段。"
                    : "不要输出其它无关内容。"
            }不要输出其它无关内容。`;
        // console.log(system);
        // console.log(prompt);
        const completion = openai.chat.completions.create({
            model: useRuntimeConfig().NITRO_MODEL,
            messages: [
                { role: "system", content: system },
                { role: "user", content: prompt },
            ],
            stream: stream ? true : undefined,
            stream_options: stream ? { include_usage: true } : undefined,
            response_format: stream ? undefined : { type: "json_object" },
        });

        const res = await completion.asResponse();

        return sendWebResponse(
            event,
            new Response(res.body, {
                headers: {
                    "Content-Type": stream
                        ? "text/event-stream"
                        : "application/json",
                    "Cache-Control": "no-cache",
                    Connection: "keep-alive",
                },
            })
        );
    };
