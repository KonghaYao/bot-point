import { JSONWrapper } from "#imports";
import { createSchemaFactory } from "drizzle-zod";
import { db } from "~/db";
import { z } from "zod";
import {
    ComposeEventHandler,
    ValidationError,
} from "~~/packages/endpoint-kit/src";
import { PgTableWithColumns, TableConfig } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";

export const createCRUD = <
    T extends PgTableWithColumns<D>,
    D extends TableConfig = any
>(
    name: string,
    reviewAgentTable: T,
    typeController: {
        insert?: boolean;
        query?: boolean;
        update?: boolean;
        delete?: boolean;
    } = {}
) => {
    const { createInsertSchema, createUpdateSchema } = createSchemaFactory({
        coerce: {
            date: true, // 尝试将匹配的字符串转换为日期
        },
    });
    const schema = z.object({
        insert: z.optional(createInsertSchema(reviewAgentTable)),
        query: z.optional(z.any()),
        update: z.optional(createUpdateSchema(reviewAgentTable)),
        delete: z.optional(
            z.object({
                id: z.number(),
            })
        ),
    });

    const dataController = async (json: any) => {
        if (json.insert && typeController.insert !== false) {
            const data = await db
                .insert(reviewAgentTable)
                .values(json.insert as any);
            return JSONWrapper(data);
        }
        if (json.update && typeController.update !== false) {
            const data = await db
                .update(reviewAgentTable)
                .set(json.update as any);
            return JSONWrapper(data);
        }
        if (json.query && typeController.query !== false) {
            const data = await db.query[name].findMany(json.query);
            return JSONWrapper(data);
        }
        if (json.delete && typeController.delete !== false) {
            const data = await db
                .delete(reviewAgentTable)
                .where(eq(reviewAgentTable.id, json.delete.id));
            return JSONWrapper(data);
        }
    };
    const handler: ComposeEventHandler = async (event) => {
        const json: z.infer<typeof schema> = useJSON(event);
        return dataController(json);
    };
    return { schema, handler, dataController };
};
