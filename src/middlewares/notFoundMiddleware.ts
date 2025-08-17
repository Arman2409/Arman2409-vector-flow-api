import type { Response } from 'express';

import { StatusCodes, ErrorMessages } from '../constants/responses';
import type { RequestWithContext } from '../types/shared/requests';

export const notFoundMiddleware = (
    _: RequestWithContext,
    res: Response,
): void => {
    res.status(StatusCodes.NOT_FOUND).json({
        error: ErrorMessages.ROUTE_NOT_FOUND
    });
};