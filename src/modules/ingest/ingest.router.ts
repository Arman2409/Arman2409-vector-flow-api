import { Router } from 'express';

import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';
import vectorService from '../../services/vectorService';
import fileService from '../../services/fileService';

const ingestRouter = Router();
const ingestController = new IngestController(new IngestService(vectorService, fileService));

ingestRouter.post('/', ingestController.ingestManyHandler);

export { ingestRouter }