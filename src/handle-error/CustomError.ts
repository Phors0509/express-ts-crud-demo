export class CustomError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string = 'Not Found') {
        super(message, 404);
    }
}

export class BadRequestError extends CustomError {
    constructor(message: string = 'Bad Request') {
        super(message, 400);
    }
}

export class InternalServerError extends CustomError {
    constructor(message: string = 'Internal Server Error') {
        super(message, 500);
    }
}