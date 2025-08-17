import OpenAI from 'openai';
import type { Stream } from 'openai/core/streaming';

import { ASK_MODEL_COMPLETION } from '../../configs/modules/ask';
import { AskBody } from './validation/askBodySchema';
import type { FileService } from '../../services/fileService';
import type { VectorService } from '../../services/vectorService';
import type { VectorDocument } from '../../types/modules/ingest';

const openai = new OpenAI();

export class AskService {
    constructor(private fileService: FileService, private vectorService: VectorService) {
        this.fileService = fileService;
        this.vectorService = vectorService;
    }

    public async askQuestion(data: AskBody): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk> & {
        _request_id?: string | null;
    } | unknown> {
        const { query, topK = 5 } = data;

        try {
            const storedVectors = await this.fileService.readJson<VectorDocument>();

            const scored = await this.vectorService.search(query, storedVectors);

            const topChunks = scored.slice(0, topK);

            const context = topChunks.map(chunk => chunk?.text).join('\n---\n');
            const prompt = `Answer the question based on the following context:\n${context}\n\nQuestion: ${query}\nAnswer:`;

            const stream = await openai.chat.completions.create({
                model: ASK_MODEL_COMPLETION,
                messages: [{ role: 'user', content: prompt }],
                stream: true,
            });

            return stream;
        } catch (err) {
            return err;
        }
    }

}