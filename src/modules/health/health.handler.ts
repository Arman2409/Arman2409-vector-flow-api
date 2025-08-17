import type { Response } from 'express';

import { TEST_MODEL_INFO } from '../../configs/modules/health';
import { StatusCodes } from "../../constants/responses";
import loggerService from "../../services/loggerService";
import type { FileService } from '../../services/fileService';
import type { RequestWithContext } from '../../types/shared/requests';

export class HealthController {
    constructor(private fileService: FileService) {
        this.fileService = fileService;
    }

    public healthCheckHandler = async (req: RequestWithContext, res: Response): Promise<void> => {
        try {
            const vectorsJson = await this.fileService.readJson();

            res.status(StatusCodes.OK).json({
                status: 'OK',
                vectorsCount: vectorsJson.length,
                modelInfo: TEST_MODEL_INFO
            });
        } catch (error) {
            loggerService.error('Error during healthCheckHandler:', error, req);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Health check failed' });
        }
    }
}