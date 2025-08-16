import type { Request, Response, NextFunction } from 'express';
import { uuidv4 } from 'zod';

interface RequestWithId extends Request {
    id?: string;
}

export const idGeneratorMiddleware = (req: RequestWithId, res: Response, next: NextFunction) => {
    req.id = uuidv4() as unknown as string;
    console.log(req.id);
    console.log(`[Request ID: ${req.id}] ${req.method} ${req.originalUrl}`);
    next(); 
}