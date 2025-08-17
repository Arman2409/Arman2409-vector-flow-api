import { Router } from 'express';

import vectorService from '../../services/vectorService';
import fileService from '../../services/fileService';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';

const ingestRouter = Router();
const ingestController = new IngestController(new IngestService(vectorService, fileService));

ingestRouter.post('/', ingestController.ingestManyHandler);

export { ingestRouter }