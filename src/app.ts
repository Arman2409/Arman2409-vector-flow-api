import express from 'express';

import {loggingAndIdMiddleware} from './middlewares/loggingAndIdMiddleware';
import {notFoundMiddleware} from './middlewares/notFoundMiddleware';
import { ingestRouter } from './modules/ingest/ingest.routes';
import type { RequestWithContext } from './types/shared/requests';

const app = express();

// Middlewares 
app.use(express.json());
app.use(loggingAndIdMiddleware);

app.get('/', (req: RequestWithContext, res) => {
    console.log(`[Request ID: ${req.id}] Received request on root path`);
    res.json({
        message: 'Welcome to the Vector Flow API! Use /ingest to add documents and /ask to query them.'
    });
});
app.use("/ingest", ingestRouter); // Use the ingest routes

app.use(notFoundMiddleware);

export default app; 