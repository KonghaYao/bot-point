export function JSONWrapper<T>(data: T): {
    code: number;
    data: T;
    msg?: string;
} {
    return {
        code: 0,
        data,
    };
}
