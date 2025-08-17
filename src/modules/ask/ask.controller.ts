import { z } from 'zod';
import OpenAI from 'openai';
import { Stream } from 'openai/core/streaming';
import type { Response } from 'express';

import { StatusCodes } from '../../constants/responses';
import loggerService from '../../services/loggerService';
import { askBodySchema, type AskBody } from './validation/askBodySchema';
import type { AskService } from './ask.service';
import type { RequestWithContext } from '../../types/shared/requests';

export interface AskController {
    askHandler(req: RequestWithContext<AskBody>, res: Response): Promise<void>;
}

export class AskController {
    constructor(private askService: AskService) {
        this.askService = askService;
    }

    public askHandler = async (req: RequestWithContext<AskBody>, res: Response) => {
        try {
            const { success, error, data } = askBodySchema.safeParse(req.body);

            if (!success) {
                res.status(StatusCodes.BAD_REQUEST).json({ error: z.prettifyError(error) });
                return;
            }

            const stream = await this.askService.askQuestion(data);

            if (stream instanceof Error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to process the request' });
                return;
            }

            res.writeHead(StatusCodes.OK, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            });

            for await (const chunk of stream as Stream<OpenAI.Chat.Completions.ChatCompletionChunk>) {
                const delta = chunk.choices[0]?.delta?.content;
                if (delta) {
                    res.write(`data: ${delta}\n\n`);
                }
            }

            res.write(`data: [DONE]\n\n`);
            res.end();
        } catch (error) {
            loggerService.error('Error during ingestManyHandler:', error, req);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to ingest data' });
        }
    }
}