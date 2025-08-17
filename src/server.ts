import dotenv from 'dotenv';

import { DEFAULT_LISTEN_PORT } from './configs/server';
import loggerService from './services/loggerService';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || DEFAULT_LISTEN_PORT;

loggerService.info(`Starting server on port ${PORT}...`);
app.listen(PORT, () => {
  loggerService.info(`Server is running on http://localhost:${PORT} `);
  loggerService.warn('Press Ctrl+C to stop the server.');
});