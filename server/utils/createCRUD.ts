import { JSONWrapper } from "#imports";
import { createSchemaFactory } from "drizzle-zod";
import { db } from "~/db";
import { z } from "zod";
import {
    ComposeEventHandler,
    ValidationError,
} from "~~/packages/endpoint-kit/src";
import { PgTableWithColumns, TableConfig } from "drizzle-orm/pg-core";
import { desc, eq } from "drizzle-orm";
import { tasksTable } from "~/db/schema";

export const createCRUD = <
    T extends PgTableWithColumns<D>,
    D extends TableConfig = any
>(
    name: string,
    table: T,
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
        insert: z.optional(createInsertSchema(table)),
        query: z.optional(z.any()),
        update: z.optional(createUpdateSchema(table)),
        delete: z.optional(
            z.object({
                id: z.number(),
            })
        ),
    });

    const dataController = async (json: any) => {
        if (json.insert && typeController.insert !== false) {
            const data = await db.insert(table).values(json.insert as any);
            return JSONWrapper(data);
        }
        if (json.update && typeController.update !== false) {
            const data = await db.update(table).set(json.update as any);
            return JSONWrapper(data);
        }
        if (json.query && typeController.query !== false) {
            const orderBy = (json.query.orderBy || []).map((i) => {
                return desc(table[i]);
            });
            const data = await db.query[name].findMany({
                limit: 10,
                ...json.query,
                orderBy,
            });
            return JSONWrapper(data);
        }
        if (json.delete && typeController.delete !== false) {
            const data = await db
                .delete(table)
                .where(eq(table.id, json.delete.id));
            return JSONWrapper(data);
        }
    };
    const handler: ComposeEventHandler = async (event) => {
        const json: z.infer<typeof schema> = useJSON(event);
        return dataController(json);
    };
    return { schema, handler, dataController };
};
