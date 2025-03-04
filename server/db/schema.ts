import {
    integer,
    pgTable,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

// 任务状态编码
export const TASK_STATUS = {
    PENDING: 0, // 待办
    IN_PROGRESS: 1, // 进行中
    COMPLETED: 2, // 已完成
    FAILED: 3, // 失败
};
export const tasksTable = pgTable("tasks", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(), // 任务的唯一标识符
    name: varchar({ length: 255 }).notNull(),
    description: text().notNull(), // 任务的详细描述
    input: text().notNull(), // 任务的输入信息，一般是 json
    status: integer().notNull().default(0), // 任务状态
    result: text(), // 任务的最终结果或输出
    createdAt: timestamp().defaultNow().notNull(), // 任务创建的时间
    updatedAt: timestamp(), // 任务最后更新的时间
});

export const reviewAgentTable = pgTable("review-agent", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(), // 任务的唯一标识符
    name: varchar({ length: 255 }).notNull().unique(), // 任务的唯一标识符，且唯一
    metadata: text(),
    rolePrompt: text().notNull(), // 角色定位提示词
    stylePrompt: text().notNull(), // 返回样式提示词
    formatPrompt: text().notNull(), // 返回格式提示词
    rulesPrompt: text().notNull(), // 审查规则提示词
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp(),
});
