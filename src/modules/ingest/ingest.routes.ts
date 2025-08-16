import { Router } from 'express';

import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';

const router = Router();
const ingestController = new IngestController(new IngestService());

router.post('/', ingestController.ingestManyHandler);

export { router }