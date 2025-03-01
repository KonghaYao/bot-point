import { z } from "zod";
import { ComposeEventHandler, ValidationError } from "endpoint-kit";
import type { H3Event } from "h3";
import { fromError } from "zod-validation-error";

/** 验证 JSON 入参正确 **/
export const validateJSON =
    <T extends z.ZodTypeAny>(schema: T): ComposeEventHandler<z.infer<T>> =>
    async (event) => {
        const body = await readValidatedBody(event, schema.safeParse);
        if (!body.data) {
            throw new ValidationError(
                "Invalid JSON body: " + fromError(body.error)
            );
        }
        event.context._json = body.data!;
    };
/** 验证 Query 入参正确 **/
export const validateQuery =
    <T extends z.ZodTypeAny>(schema: T): ComposeEventHandler<z.infer<T>> =>
    async (event) => {
        const body = await getValidatedQuery(event, schema.safeParse);
        if (!body.data) {
            throw new ValidationError(
                "Invalid QueryParams: " + fromError(body.error)
            );
        }
        event.context._json = body.data!;
    };

/** 获取用户 */
export const useJSON = <T>(event: H3Event<Request>): T => {
    return event.context._json;
};
