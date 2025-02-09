import { defineCompose } from "endpoint-kit";
import { z } from "zod";

const schema = z.object({
    /** 输入文章 */
    article: z.string(),
    /** 生成 tag 数量 */
    tagLength: z.number().default(10),
});

export default defineCompose(
    authLayer(),
    validateJSON(schema),

    defineAI({
        onlyJson: true,
        getPrompt(event) {
            const json: z.infer<typeof schema> = useJSON(event);
            return `你是一位专业的数字内容管理助手，任务是根据提供的文章内容生成相关的${json.tagLength}个标签。这些标签应该简洁且具有代表性，能够准确反映文章的核心主题和关键点。请按照以下步骤处理：

1. 阅读并理解所提供的文章。
2. 确定文章中的主要主题、关键词以及任何值得注意的概念或实体。
3. 为每个识别出的主题或概念生成简短的标签，确保标签与文章内容紧密相关，并能帮助读者快速了解文章的大致内容。
4. 列出所有生成的标签，不用解释为什么选择它们。

现在，请阅读以下文章，并为它生成适当的标签：
${json.article}`;
        },
    })
);
