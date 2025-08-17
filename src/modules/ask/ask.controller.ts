import { z } from 'zod';
import type { Response } from 'express';

import { StatusCodes } from '../../constants/responses';
import loggerService from '../../services/loggerService';
import { askBodySchema, type AskBody } from './validation/askBodySchema';
import type { AskService } from './ask.service';
import type { RequestWithContext } from '../../types/shared/requests';

export interface AskController {
    askHandler(req: RequestWithContext<AskBody>, res: Response): Promise<void>;
}

export class AskController {
    constructor(private askService: AskService) {
        this.askService = askService;
    }

    public askHandler = async (req: RequestWithContext<AskBody>, res: Response) => {
        try {
            const { success, error, data } = askBodySchema.safeParse(req.body);

            if (!success) {
                res.status(StatusCodes.BAD_REQUEST).json({ error: z.prettifyError(error) });
                return;
            }

            console.log("herer");
            console.log(this.askService);
            const result = await this.askService.askQuestion(data, res);

            // res.status(StatusCodes.OK).json(result);

        } catch (error) {
            loggerService.error('Error during ingestManyHandler:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to ingest data' });
        }
    }
}