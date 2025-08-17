import chalk from 'chalk';
import { randomUUID } from 'crypto';
import type { Response, NextFunction } from 'express';

import loggerService from '../services/loggerService';
import type { RequestWithContext } from '../types/shared/requests';

export const loggingAndRequestIdMiddleware = (
    req: RequestWithContext,
    _: Response,
    next: NextFunction

    
): void => {
    // Gather log details
    const method = req.method;
    const url = req.originalUrl || req.url;
    const body = req.body || {};
    
    // Generate a unique request ID and attach it to the request
    const requestId =  randomUUID();
    req.id = requestId;

    // Format log message
    // The logic to build the request details string
    const requestDetailsLog = `method="${chalk.magenta(method)}" path="${chalk.magenta(url)}" reqId="${requestId}"`;

    // Conditionally add the request body
    const bodyLog = method !== "GET" && Object.keys(body).length > 0
        ? ` body=${JSON.stringify(req.body)}`
        : "";

    // Combine everything into a clear, structured log message
    const logMessage = `${requestDetailsLog}${bodyLog}`;

    loggerService.info(logMessage);

    next();
}