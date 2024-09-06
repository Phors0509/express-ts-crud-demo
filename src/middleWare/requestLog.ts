
import { Request, Response, NextFunction } from 'express';

export const requestLog = (_req: Request, _res: Response, next: NextFunction) => {
    console.log(`Request received at ${new Date().toLocaleDateString()}`)
    next();
}