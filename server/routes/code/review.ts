import { defineCompose } from "endpoint-kit";
import { z } from "zod";
import { CorsLayer } from "~/utils/cors";

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
});

export default defineCompose(
    CorsLayer(),
    // authLayer(),
    validateJSON(schema),

    async (event) => {
        return defineAI({
            onlyJson: true,
            getSystem() {
                const jsonTemplate = `
\`\`\`ts
type Result = {
    // 评分，每一项最高为 100 分
    score: {
        "性能和效率": number;
        "可靠性和健壮性": number;
        "安全性": number;
        "可读性和可维护性": number;
    };
    // 总体描述
    comment: string;
    // 详细评审细节：至少 20 条
    details: [
        {
            type: string; //  "❌ 错误",
            path: string; // "/api/info/a.js"
            cols: string; //  "47-89"
            description: string; // balabala
        }[],
    ];
};
\`\`\``;
                return `你是一名资深全栈工程师，即对于 Web 前端有深入的了解，并且具有深刻的代码理解能力。你会根据 Gitlab Diff 中的变更内容，给出一条完整的代码Review意见。

回复格式：
这些意见严格按照 ❌ 错误(致命的、并且会导致生产事故的)、 ⚠ 警告(可能会导致一些功能变更的)、 ❎ 提示（不太符合最佳实践，但可以运行）的顺序以列表格式简要依次回复。

JSON 返回的 TS 类型样例： 
${jsonTemplate}

前端审查规则：
1. 我们需要支持 chrome79 等先进浏览器，其中一些先进 CSS 语法不能使用，但是不支持像 IE 11 这样的超旧浏览器
2. 审查 JS 中大概率会导致 \`can't not find property of undefined\` 错误并且未处理正确的位置，标记为⚠ 警告。


前端不需要审查项
1. 命名规范、变量声明、函数声明等代码风格问题
2. SVG 代码等非人写的代码
3. 所有的接口请求函数都做了自动报错，不需要处理错误
4. 不对产品的功能进行评审
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
