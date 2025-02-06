import { defineCompose } from "endpoint-kit";
import { z } from "zod";

const schema = z.object({
    target: z.string().default("英文"),
    article: z.string(),
    // resultLength: z.number().optional().default(200),
});

export default defineCompose(
    validateJSON(schema),
    defineAI({
        getPrompt(event) {
            const json: z.infer<typeof schema> = useJSON(event)
            return `请忠实地将下面的文本翻译为${json.target}, 请根据以下内容回复到 translation 字段：${json.article}`
        },

    })
)