import type { FileService } from '../../services/fileService';
import type { VectorService } from '../../services/vectorService';
import type { Document } from '../../types/modules/ingest';

export class IngestService {
  constructor(
    private vectorsService: VectorService,
    private fileService: FileService
  ) {
    this.vectorsService = vectorsService;
    this.fileService = fileService;
  }

  public async ingestDocuments(documents: Document[]): Promise<any> {
    const startTime = Date.now();
    let totalChunks = 0;
    const allChunks: any[] = [];

    // 1. Chunk documents
    documents.forEach(async (doc) => {
      const chunks = await this.chunkDocumentAndAddVector(doc);
      allChunks.push(...chunks);
      totalChunks += chunks.length;
    });

    await this.fileService.appendJson(allChunks);

    // 4. Return counts and timing
    const elapsedMs = Date.now() - startTime;

    return {
      documentCount: documents.length,
      chunkCount: totalChunks,
      elapsedMs,
    };
  }

  private async chunkDocumentAndAddVector({ id, text, metadata}: Document, chunkSize: number = 700, overlap: number = 100) {
    const words = text.split(/\s+/);
    const chunks = [];
    let start = 0;
    let chunkIndex = 0;

    while (start < words.length) {
      const end = Math.min(start + chunkSize, words.length);
      const chunkText = words.slice(start, end).join(' ');

      const vector = await this.vectorsService.createEmbeddings(chunkText);

      chunks.push({
        id: `${id}_chunk${chunkIndex}`,
        vector,
        metadata: metadata,
      });

      chunkIndex++;
      start += chunkSize - overlap; // move start with overlap
    }

    return chunks;
  }
}