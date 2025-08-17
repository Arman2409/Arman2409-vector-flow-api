import type { Response } from 'express';

import { StatusCodes } from "../../constants/responses";
import loggerService from "../../services/loggerService";
import type { FileService } from '../../services/fileService';
import type { RequestWithContext } from '../../types/shared/requests';

export class HealthController {
    constructor(private fileService: FileService) {
        this.fileService = fileService;
    }

    public healthCheckHandler = async (_: RequestWithContext, res: Response): Promise<void> => {
        try {
            const vectorsJson = await this.fileService.readJson();

            res.status(StatusCodes.OK).json({
                status: 'OK',
                vectorsCount: vectorsJson.length,
            });
        } catch (error) {
            loggerService.error('Error during healthCheckHandler:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Health check failed' });
        }
    }
}