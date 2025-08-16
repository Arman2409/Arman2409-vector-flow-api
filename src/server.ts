import dotenv from 'dotenv';

import { DEFAULT_LISTEN_PORT } from './configs/server';
import logger from './services/logger';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || DEFAULT_LISTEN_PORT;

logger.info(`Starting server on port ${PORT}...`);
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT} `);
  logger.warn('Press Ctrl+C to stop the server.');
});