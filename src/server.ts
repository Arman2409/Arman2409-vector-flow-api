import { DEFAULT_LISTEN_PORT } from './configs/server';
import loggerService from './services/loggerService';
import app from './app';

const PORT = process.env.PORT || DEFAULT_LISTEN_PORT;

app.listen(PORT, () => {
  loggerService.info(`Server is running on port ${PORT} `);
});