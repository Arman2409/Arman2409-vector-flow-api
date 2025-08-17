import { Router } from 'express';

import fileService from '../../services/fileService';
import { AskController } from './ask.controller';
import { AskService } from './ask.service';

const askRouter = Router();
const askController = new AskController(new AskService(fileService));

askRouter.post('/', askController.askHandler);

export { askRouter };