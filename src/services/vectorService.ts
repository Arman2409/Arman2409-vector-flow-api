import { FeatureExtractionPipeline, pipeline } from '@xenova/transformers';

import { XENOVA_MODEL_NAME } from '../configs/services';

export interface VectorService {
  createEmbeddings(texts: string | string[]): Promise<number[][]>;
  search(query: string): Promise<any[]>;
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


  public async search(query: string): Promise<any[]> {
    // 1. Create a vector for the query
    const queryVector = await this.createEmbeddings([query]);
    const normalizedQueryVector = queryVector[0];

    // 2. Load all stored vectors
    const storedVectors = await this.loadVectors();

    // 3. Compute cosine similarity and rank results
    const results = storedVectors.map(item => ({
      ...item,
      score: this.cosineSimilarity(normalizedQueryVector, item.vector),
    }));

    results.sort((a, b) => b.score - a.score);

    return results;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
    }
    return dotProduct; // Works for normalized vectors
  }
}

export default VectorService.getInstance();