import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
    statusCode: number;
    message: string
}

const errorHandler = (err: AppError, _req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: "error",
        statusCode,
        message: err.message
    });
};

export { errorHandler, AppError }