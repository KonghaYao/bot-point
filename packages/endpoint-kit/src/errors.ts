import { createError } from "h3";

// 定义一个基础的自定义Error类
export class CustomError extends Error {
    name: string;
    httpCode: number;
    isOperational: boolean;
    constructor(
        name: string,
        httpCode: number,
        description: string,
        isOperational?: boolean
    ) {
        // 参数类型检查
        if (typeof name !== "string" || name.trim() === "") {
            throw new TypeError("Name must be a non-empty string");
        }
        if (typeof httpCode !== "number" || !Number.isInteger(httpCode)) {
            throw new TypeError("HTTP code must be an integer");
        }
        if (typeof description !== "string" || description.trim() === "") {
            throw new TypeError("Description must be a non-empty string");
        }

        super(description);
        this.name = name;
        this.httpCode = httpCode;
        this.isOperational =
            isOperational === undefined ? true : !!isOperational;

        try {
            Error.captureStackTrace(this, this.constructor);
        } catch (error) {
            console.error("Failed to capture stack trace:", error);
        }
    }
    toH3Error() {
        return createError({
            status: this.httpCode,
            statusMessage: this.message,
            message: this.message,
        });
    }
}

export class AuthorizationError extends CustomError {
    constructor(description = "Unauthorized") {
        super("AuthorizationError", 401, description, true);
    }
}

export class ValidationError extends CustomError {
    constructor(description = "Invalid Query or body") {
        super("ValidationError", 412, description, true);
    }
}
export class VoidError extends CustomError {
    constructor(description = "Void cause Error") {
        super("VoidError", 412, description, true);
    }
}

export class NotFoundError extends CustomError {
    constructor(description = "Resource not found") {
        super("NotFoundError", 404, description, true);
    }
}

export class DatabaseError extends CustomError {
    constructor(description = "Database error") {
        super("DatabaseError", 500, description, true);
    }
}
export class NetworkResourceError extends CustomError {
    constructor(description = "NetworkResourceError") {
        super("NetworkResourceError", 500, description, true);
    }
}
