// src/app.ts
import express from 'express';
// import { v4 as uuidv4 } from 'uuid'; // For generating unique request IDs
// import { z } from 'zod'; // For input validation
// import { chunkText, cosine, normalize } from './utils'; // Your utility functions
// import { embeddingsService } from './embeddingsService'; // Your embedding service (mock or real)
// import { llmService } from './llmService'; // Your LLM service (mock or real)
// import { loadVectors, saveVectors } from './vectorStorage'; // Functions for local vector storage
// import { StoredChunk } from './interfaces'; // Interface for stored data
import loggingMiddleware from './middlewares/loggingMiddleware';
import notFoundMiddleware from './middlewares/notFoundMiddleware';
import { idGeneratorMiddleware } from './middlewares/idGeneratorMiddleware';

const app = express();

// Middlewares 
app.use(express.json());
app.use(loggingMiddleware);
app.use(idGeneratorMiddleware);

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Vector Flow API! Use /ingest to add documents and /ask to query them.'
    });
});

app.use(notFoundMiddleware);

export default app; // Export the Express app instance
// // 1. POST /ingest
// // Input validation schema for the /ingest endpoint
// const ingestInputSchema = z.array(z.object({
//   id: z.string().min(1, "Document ID cannot be empty."),
//   text: z.string().min(1, "Text content cannot be empty."),
//   metadata: z.record(z.any()).optional(), // Optional metadata object
// }));

// app.post('/ingest', async (req: Request, res: Response, next: NextFunction) => {
//   const startTime = process.hrtime.bigint(); // Start time for performance measurement
//   let chunksSaved = 0;

//   try {
//     // Validate the incoming request body against the schema
//     const documents = ingestInputSchema.parse(req.body);

//     // Load existing vectors from the local file
//     const allStoredChunks = await loadVectors();
//     const newChunksToStore: StoredChunk[] = [];

//     // Process each document
//     for (const doc of documents) {
//       // Split long text into smaller chunks
//       // Using 2000 characters as a rough estimate for ~500 tokens (4 chars/token)
//       const textChunks = chunkText(doc.text, 2000, 100);
      
//       // Get embeddings (vectors) for all text chunks from the embedding service
//       const vectors = await embeddingsService.embed(textChunks);

//       // Store each chunk with its ID, text, metadata, and normalized vector
//       for (let i = 0; i < textChunks.length; i++) {
//         const normalizedVector = normalize(vectors[i]); // Normalize the vector
//         newChunksToStore.push({
//           id: `${doc.id}#chunk${i}`, // Create a unique ID for each chunk
//           text: textChunks[i],
//           metadata: doc.metadata || {}, // Use provided metadata or an empty object
//           vector: normalizedVector,
//         });
//         chunksSaved++;
//       }
//     }

//     // Append new chunks to existing ones and save back to the file
//     await saveVectors([...allStoredChunks, ...newChunksToStore]);

//     const endTime = process.hrtime.bigint(); // End time
//     const durationMs = Number(endTime - startTime) / 1_000_000; // Calculate duration in milliseconds

//     // Send success response with counts and duration
//     res.status(200).json({
//       docsIngested: documents.length,
//       chunksSaved: chunksSaved,
//       durationMs: durationMs.toFixed(2), // Format to 2 decimal places
//     });
//   } catch (error) {
//     // If an error occurs, pass it to the central error handler
//     next(error);
//   }
// });

// // 2. POST /ask
// // Input validation schema for the /ask endpoint
// const askInputSchema = z.object({
//   query: z.string().min(1, "Query cannot be empty."),
//   topK: z.number().int().min(1, "topK must be at least 1.").default(5), // Default to 5 if not provided
//   maxTokens: z.number().int().min(1, "maxTokens must be at least 1.").default(200), // Default to 200
// });

// app.post('/ask', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // Validate the incoming request body
//     const { query, topK, maxTokens } = askInputSchema.parse(req.body);

//     // Get the embedding (vector) for the user's query
//     const queryVectorRaw = (await embeddingsService.embed([query]))[0];
//     const queryVector = normalize(queryVectorRaw); // Normalize the query vector

//     // Load all stored chunks from the local file
//     const storedChunks = await loadVectors();

//     // Handle case where no documents have been ingested yet
//     if (storedChunks.length === 0) {
//       // Set headers for Server-Sent Events (SSE)
//       res.writeHead(200, {
//         'Content-Type': 'text/event-stream',
//         'Cache-Control': 'no-cache',
//         'Connection': 'keep-alive',
//       });
//       // Send a "token" event with an informative message
//       res.write('data: {"type":"token","text":"No documents ingested yet. Please ingest some text first."}\n\n');
//       // Send a "final" event with empty citations
//       res.write('data: {"type":"final","citations":[]}\n\n');
//       return res.end(); // End the response
//     }

//     // Compute cosine similarity between query vector and all stored chunk vectors
//     const rankedChunks = storedChunks
//       .map(chunk => ({
//         ...chunk,
//         score: cosine(queryVector, chunk.vector), // Calculate similarity score
//       }))
//       .sort((a, b) => b.score - a.score) // Sort in descending order by score
//       .slice(0, topK); // Select the top K most similar chunks

//     // Build the context string from the top K chunks for the LLM
//     const context = rankedChunks.map(c => `Chunk ID: ${c.id}\nText: ${c.text}`).join('\n\n');

//     // Construct the full prompt for the LLM
//     const prompt = `Based on the following context, answer the question:\n\n${context}\n\nQuestion: ${query}\n\nAnswer:`;

//     // Set headers for Server-Sent Events (SSE) for the LLM response
//     res.writeHead(200, {
//       'Content-Type': 'text/event-stream',
//       'Cache-Control': 'no-cache',
//       'Connection': 'keep-alive',
//     });

//     // Stream tokens from the LLM service
//     for await (const token of llmService.stream(prompt, { maxTokens })) {
//       // Send each token as an SSE "token" event
//       res.write(`data: {"type":"token","text":${JSON.stringify(token)}}\n\n`);
//     }

//     // Prepare citations for the final event
//     const citations = rankedChunks.map(chunk => ({
//       id: chunk.id,
//       score: parseFloat(chunk.score.toFixed(4)), // Format score to 4 decimal places
//     }));
//     // Send the final "final" event with citations
//     res.write(`data: {"type":"final","citations":${JSON.stringify(citations)}}\n\n`);
//     res.end(); // End the response
//   } catch (error) {
//     // If an error occurs, handle it gracefully for streaming responses.
//     // If headers haven't been sent yet, send a JSON error.
//     if (!res.headersSent) {
//       next(error); // Pass to central error handler
//     } else {
//       // If headers already sent (streaming has started), send an error event
//       console.error(`[Request ID: ${req.id}] Error during /ask streaming:`, error);
//       res.write(`data: {"type":"error","message":${JSON.stringify(error instanceof Error ? error.message : "An unknown error occurred during streaming")}}\n\n`);
//       res.end(); // Ensure the connection is closed
//     }
//   }
// });

// // 3. GET /health
// app.get('/health', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // Load all stored chunks to get the vector count
//     const storedChunks = await loadVectors();
//     const vectorCount = storedChunks.length;

//     // Provide mock/placeholder model information
//     const modelInfo = {
//       embeddingModel: 'MockEmbeddings (replace with all-MiniLM-L6-v2 or similar)',
//       llmModel: 'MockLLM (replace with OpenAI GPT-3.5-turbo or similar)',
//       embeddingDimension: 384, // Common dimension for all-MiniLM-L6-v2
//     };

//     // Send health status response
//     res.status(200).json({
//       status: 'ok',
//       vectorCount,
//       modelInfo,
//     });
//   } catch (error) {
//     // Pass any errors to the central error handler
//     next(error);
//   }
// });

// // Centralized Error Handler Middleware
// // This must be the last middleware in the chain
// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   console.error(`[Request ID: ${req.id}] Unhandled Error:`, err);

//   // Handle Zod validation errors specifically
//   if (err.name === 'ZodError') {
//     return res.status(400).json({
//       error: 'Validation Error',
//       details: err.errors, // Zod provides detailed validation errors
//       requestId: req.id,
//     });
//   }

//   // Handle other types of errors
//   res.status(err.status || 500).json({
//     error: err.message || 'An unexpected server error occurred.',
//     requestId: req.id,
//   });
// });

// export default app; // Export the Express app instance