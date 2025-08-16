import type { Request, Response } from 'express';

import { StatusCodes, ErrorMessages } from '../constants/responses';

export const notFoundMiddleware = (
    _: Request,
    res: Response,
): void => {
    res.status(StatusCodes.NOT_FOUND).json({
        error: ErrorMessages.ROUTE_NOT_FOUND
    });
};