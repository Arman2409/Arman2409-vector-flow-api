import { FeatureExtractionPipeline, pipeline } from '@xenova/transformers';

import { XENOVA_MODEL_NAME } from '../configs/services';
import type { VectorDocument, VectorDocumentScored } from '../types/modules/ingest';

export interface VectorService {
  createEmbeddings(texts: string | string[]): Promise<number[][]>;
  search(query: string, storedVectors: VectorDocument[]): Promise<any[]>;
}

export class VectorService {
  private pipe: Promise<FeatureExtractionPipeline>;
  static instance: VectorService;

  constructor() {
    this.pipe = pipeline('feature-extraction', XENOVA_MODEL_NAME);
  }

  public static getInstance(): VectorService {
    if (!VectorService.instance) {
      VectorService.instance = new VectorService();
    }
    return VectorService.instance;
  }

  public async createEmbeddings(texts: string | string[]): Promise<number[][]> {
    const extractor = await this.pipe;
    const output = await extractor(texts, {
      pooling: 'mean',
      normalize: true,
    });

    return output.tolist();
  }


  public async search(query: string, storedVectors: VectorDocument[]): Promise<VectorDocumentScored[]> {
    // 1. Create a vector for the query
    const queryVector = await this.createEmbeddings([query]);
    const normalizedQueryVector = queryVector[0];

    // 3. Compute cosine similarity and rank results
    const results = storedVectors.map(item => ({
      ...item,
      score: this.cosineSimilarity(normalizedQueryVector, item.vector as unknown as number[]),
    }));

    results.sort((a, b) => b.score - a.score);

    return results;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
    const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));

    return dot / (normA * normB);
  }
}

export default VectorService.getInstance();