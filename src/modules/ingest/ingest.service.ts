// import { Embeddings } from '../../shared/embeddings';
// import { VectorStore } from '../../shared/vector-store';
import type { VectorService } from '../../services/vectorService';
import type { Document } from '../../types/modules/ingest';

export class IngestService {
  constructor(
    private vectorsService: VectorService,
) {
  this.vectorsService = vectorsService;
}

  public async ingestDocuments(documents: Document[]): Promise<any> {
    // 1. Loop through documents and chunk them
    const chunks = documents.flatMap(doc => this.chunkText(doc));

    // 2. Embed the chunks to get vectors
    const textsToEmbed = chunks.map(chunk => chunk.text);
    const vectors = await this.vectorsService.ingest(textsToEmbed);

    // 3. Store chunks and their vectors
    // const result = await this.vectorStore.saveVectors(chunks, vectors);
    return true;
  }

  private chunkText(doc: any): any[] {
    // Your chunking logic here
    return [];
  }
}