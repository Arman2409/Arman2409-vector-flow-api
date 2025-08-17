import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';

import { AskBody } from './validation/askBodySchema';

import { ErrorMessages, StatusCodes } from '../../constants/responses';
import { FileService } from '../../services/fileService';
import { Response } from 'express';
import { ASK_MODEL_COMPLETION, ASK_MODEL_EMBEDDING } from '../../configs/modules/ask';
import { cosineSimilarity } from './utils/cosineSimilarity';

const openai = new OpenAI();

export class AskService {
   constructor(private fileService: FileService) {
        this.fileService = fileService;
        console.log(fileService);
    }

    public async askQuestion(data: AskBody, res: Response) {
        const { query, topK = 5 } = data;

        try {
            const embeddingResp = await openai.embeddings.create({
                model: ASK_MODEL_EMBEDDING,
                input: query,
            });

            const queryVector = embeddingResp.data[0].embedding;

            const storedVectors = await this.fileService.readJson();

            const scored = storedVectors.map((item: any) => ({
                ...item,
                score: cosineSimilarity(queryVector, item.vector),
            }));

            const topChunks = scored.sort((a, b) => b.score - a.score).slice(0, topK);

            const context = topChunks.map(c => `ID: ${c.id}\n${c.text}`).join('\n---\n');
            const prompt = `Answer the question based on the following context:\n${context}\n\nQuestion: ${query}\nAnswer:`;

            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            });

            const stream = await openai.chat.completions.create({
                model: ASK_MODEL_COMPLETION,
                messages: [{ role: 'user', content: prompt }],
                stream: true,
            });

            for await (const chunk of stream) {
                const delta = chunk.choices[0]?.delta?.content;
                if (delta) {
                    res.write(`data: ${delta}\n\n`);
                }
            }

            res.write(`data: [DONE]\n\n`);
            res.end();
        } catch (err: any) {
            console.error('Error in /ask:', err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.SERVER_ERROR });
        }
    }

}