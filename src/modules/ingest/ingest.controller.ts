import { z } from 'zod';
import type { Response } from 'express';

import { StatusCodes } from '../../constants/responses';
import loggerService from '../../services/loggerService';
import { IngestService } from './ingest.service';
import { IngestManyBody, ingestManyBodySchema } from './validation/ingestManyBodySchema';
import type { RequestWithContext } from '../../types/shared/requests';

export interface IngestController {
  ingestManyHandler(req: RequestWithContext<IngestManyBody>, res: Response): Promise<void>;
}

export class IngestController {
  constructor(private ingestService: IngestService) {
    this.ingestService = ingestService;
  }

  public ingestManyHandler = async (req: RequestWithContext<IngestManyBody>, res: Response): Promise<void> => {
    try {
      const { success, error, data} = ingestManyBodySchema.safeParse(req.body);

      if (!success) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: z.prettifyError(error) });
        return;
      }

      const result = await this.ingestService.ingestDocuments(data);

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      loggerService.error('Error during ingestManyHandler:', error, req);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to ingest data' });
    }
  }
}