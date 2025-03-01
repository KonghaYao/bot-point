import { eq } from "drizzle-orm";
import { defineCompose } from "endpoint-kit";
import { z } from "zod";
import { db } from "~/db";
import { reviewAgentTable } from "~/db/schema";

// 定义 FileDiffInfo 的 Zod schema
const FileDiffInfoSchema = z.object({
    old_path: z.string(),
    new_path: z.string(),
    renamed_file: z.boolean(),
    new_file: z.boolean(),
    deleted_file: z.boolean(),
    diff: z.string(),
});

function fileDiffInfoToText(
    fileDiff: z.infer<typeof FileDiffInfoSchema>
): string {
    // 首先提取出所有需要转换为文本的属性值
    const { new_file, renamed_file, deleted_file, old_path, new_path, diff } =
        fileDiff;

    // 构建文本描述
    let description = "";

    // 根据布尔值添加文件状态信息
    if (new_file) description += "新文件 ";
    if (renamed_file) description += "重命名 ";
    if (deleted_file) description += "已删除 ";

    // 添加路径信息

    if (old_path === new_path) {
        description += `文件 ${new_path} `;
    } else {
        description += `旧路径 ${old_path} `;
        description += `新路径 ${new_path} `;
    }

    // 最后添加差异详情
    if (diff) description += `\n差异：\n${diff}\n`;

    return description;
}
const schema = z.object({
    /** 输入代码 diff */
    allDiffs: z.array(FileDiffInfoSchema),
    /** 项目详情 */
    projectDetails: z.string(),
    agentName: z.string(),
});

export default defineCompose(
    // CorsLayer(),
    // authLayer(),
    validateJSON(schema),

    async (event) => {
        const json: z.infer<typeof schema> = useJSON(event);
        const target = await db.query.reviewAgentTable.findFirst({
            where: eq(reviewAgentTable.name, json.agentName),
        });

        return defineAI({
            modelName: "qwen2.5-coder-32b-instruct",
            onlyJson: true,
            dryRun: false,
            getSystem() {
                return `${target.rolePrompt}

回复格式：
${target.stylePrompt}

JSON 返回的 TS 类型样例： 
\`\`\`ts
${target.formatPrompt}
\`\`\`

${target.rulesPrompt}
`;
            },
            getPrompt(event) {
                const json: z.infer<typeof schema> = useJSON(event);
                return `这是我们项目的描述信息：

${json.projectDetails}

下面是这次评审的代码 ：

${json.allDiffs.map(fileDiffInfoToText).join("\n\n")}`;
            },
        })(event);
    }
);
