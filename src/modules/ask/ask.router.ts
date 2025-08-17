import { Router } from 'express';

import fileService from '../../services/fileService';
import vectorService from '../../services/vectorService';
import { AskController } from './ask.controller';
import { AskService } from './ask.service';

const askRouter = Router();
const askController = new AskController(new AskService(fileService, vectorService));

askRouter.post('/', askController.askHandler);

export { askRouter };