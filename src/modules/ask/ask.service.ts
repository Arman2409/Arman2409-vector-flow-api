import OpenAI from 'openai';
import type { Response } from 'express';

import { AskBody } from './validation/askBodySchema';

import { ASK_MODEL_COMPLETION } from '../../configs/modules/ask';
import { ErrorMessages, StatusCodes } from '../../constants/responses';
import type { FileService } from '../../services/fileService';
import type { VectorService } from '../../services/vectorService';
import type { VectorDocument } from '../../types/modules/ingest';

const openai = new OpenAI();

export class AskService {
    constructor(private fileService: FileService, private vectorService: VectorService) {
        this.fileService = fileService;
        this.vectorService = vectorService;
    }

    public async askQuestion(data: AskBody, res: Response) {
        const { query, topK = 5 } = data;

        try {
            const storedVectors = await this.fileService.readJson<VectorDocument>();

            const scored = await this.vectorService.search(query, storedVectors);

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
        } catch (err) {
            console.error('Error in /ask:', err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.SERVER_ERROR });
        }
    }

}