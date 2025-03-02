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

export function TextWrapper(data: string) {
    return new Response(data, {
        // utf8
        headers: {
            "Content-Type": "text/html;charset=utf-8",
        },
    });
}
