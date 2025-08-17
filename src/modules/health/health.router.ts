import express from 'express';

import { HealthController } from './health.handler';
import fileService from '../../services/fileService';

const healthRouter = express.Router();
const healthController = new HealthController(fileService);

healthRouter.get('/', healthController.healthCheckHandler);

export { healthRouter };