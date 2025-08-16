import type { Response } from 'express';

import { IngestService } from './ingest.service';
import { StatusCodes } from '../../constants/responses';
import type { RequestWithContext } from '../../types/shared/requests';
import type { IngestRequestPayload } from '../../types/modules/ingest';

export interface IngestController {
  ingestManyHandler(req: RequestWithContext<IngestRequestPayload>, res: Response): Promise<void>;
}

export class IngestController {
  constructor(private ingestService: IngestService) {}

  public async ingestManyHandler(req: RequestWithContext<IngestRequestPayload>, res: Response): Promise<void> {
    try {
      const documents = req.body;
      const result = await this.ingestService.ingestDocuments(documents);

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      // Centralized error handler will catch this, but good to have a catch block
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to ingest data' });
    }
  }
}