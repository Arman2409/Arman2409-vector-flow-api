import { randomUUID } from 'crypto';
import type { Response, NextFunction } from 'express';

import logger from '../services/logger';
import type { RequestWithContext } from '../types/shared/requests';

export const loggingAndIdMiddleware = (
    req: RequestWithContext,
    _: Response,
    next: NextFunction
): void => {
    
    // Gather log details
    const remoteAddr = req.ip || req.socket.remoteAddress || '-';
    const method = req.method;
    const url = req.originalUrl || req.url;
    const referrer = req.get('Referrer') || req.get('Referer');

    // Generate a unique request ID and attach it to the request
    req.id = randomUUID();
 console.log(`[Request ID: ${req.id}] Processing request: ${method} ${url}`);
    // Format log message
    const logMessage = `"${method}" "${url}" "${req.id}" ${!(req.method === "GET" ) ? JSON.stringify(req.body) : ""}"} "${remoteAddr}" "${referrer}" `;



    
    logger.info(logMessage);

    next();
}