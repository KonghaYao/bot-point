import {
    type EventHandlerResponse,
    type H3Event,
    type EventHandler,
    type EventHandlerRequest,
    defineEventHandler,
} from "h3";
import { CustomError } from "./errors";
/** 用于标记函数返回的类型，无实际用途 */
export interface WrappedEventHandler<
    Input = unknown,
    Response extends EventHandlerResponse = EventHandlerResponse
> extends EventHandler<EventHandlerRequest, Promise<{} | undefined>> {}

export interface ComposeEventHandler<
    /** 入参，给前端自动生成 */
    Input = null,
    /** 出参，给前端自动生成 */
    Response extends EventHandlerResponse = EventHandlerResponse,
    Request extends EventHandlerRequest = EventHandlerRequest
> {
    (event: H3Event<Request>): Response;
}

export interface ConditionEventHandler<D = boolean> {
    (event: H3Event<Request>): D | Promise<D>;
}

export type EndPoint<T, D> = (
    ...args: [...ComposeEventHandler<T, unknown>[], ComposeEventHandler<T, D>]
) => WrappedEventHandler<T, D>;

/** 简单实现 compose，并不需要 next 函数来支持 */
export const defineCompose = <T, D>(
    ...args: [
        ...ComposeEventHandler<T, unknown | D>[],
        ComposeEventHandler<T, D>
    ]
): WrappedEventHandler<T, D> => {
    return defineEventHandler(async (event) => {
        event.context._afterResponse = [];
        for (const handler of args) {
            try {
                const result = await handler(event);
                if (result) {
                    for (const callback of event.context
                        ._afterResponse as AfterResponseCallback<D>[]) {
                        await callback(result as D);
                    }
                    return result;
                }
            } catch (e) {
                if (e instanceof CustomError) {
                    throw e.toH3Error();
                }
                console.error(e);
                throw e;
            }
        }
    });
};

export type AfterResponseCallback<T> = (result: T) => Promise<void> | void;
export const useAfterResponse = <T>(
    event: H3Event,
    callback: AfterResponseCallback<T>
) => {
    event.context._afterResponse.unshift(callback);
};

export const defineCachedCompose = <T, D>(
    ...args: [
        ...ComposeEventHandler<T, unknown | D>[],
        ComposeEventHandler<T, D>
    ]
): ((opts: any) => WrappedEventHandler<T, D>) => {
    return (
        opts: Parameters<typeof defineCachedEventHandler>[1]
    ): WrappedEventHandler<T, D> =>
        /** @ts-ignore */
        defineCachedEventHandler(async (event) => {
            for (const handler of args) {
                try {
                    const result = await handler(event);
                    if (result) {
                        return result;
                    }
                } catch (e) {
                    if (e instanceof CustomError) {
                        console.error(e);
                        throw e.toH3Error();
                    }
                    throw e;
                }
            }
        }, opts);
};
