import { defineCompose } from "endpoint-kit";
import { z } from "zod";

const schema = z.object({
    article: z.string(),
    resultLength: z.number().default(200),
});

export default defineCompose(
    authLayer(),
    validateJSON(schema),
    defineAI({
        getPrompt(event) {
            const json: z.infer<typeof schema> = useJSON(event);
            return `请将以下文本总结为${json.resultLength}字左右的内容，确保总结简洁明了、易于理解，并且能够抓住原文的主要观点。这段文本将会显示在搜索引擎中，需要很好的 SEO 总结。请根据以下内容回复：
${json.article}`;
        },
    })
);
