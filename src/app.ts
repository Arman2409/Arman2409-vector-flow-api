import express from 'express';

import { loggingAndRequestIdMiddleware } from './middlewares/loggingAndRequestIdMiddleware';
import { notFoundMiddleware } from './middlewares/notFoundMiddleware';
import { ingestRouter } from './modules/ingest/ingest.router';
import { healthRouter } from './modules/health/health.router';

const app = express();

// Middlewares 
app.use(express.json());
app.use(loggingAndRequestIdMiddleware);
 
// Routes
app.use("/ingest", ingestRouter);
app.use("/health", healthRouter);

app.use(notFoundMiddleware);

export default app; 