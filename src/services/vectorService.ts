import { existsSync, readFileSync, writeFileSync } from 'fs';
import { FeatureExtractionPipeline, pipeline, Pipeline } from '@xenova/transformers';

const VECTORS_FILE = 'data/vectors.json';
const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';

export class VectorService {
  private pipe: Promise<FeatureExtractionPipeline>;
  static instance: VectorService;

  constructor() {
    this.pipe = pipeline('feature-extraction', MODEL_NAME);
  }

  public static getInstance(): VectorService {
    if (!VectorService.instance) {
      VectorService.instance = new VectorService();
    }
    return VectorService.instance;
  }

  private async createEmbeddings(texts: string[]): Promise<number[][]> {
    const extractor = await this.pipe;
    const output = await extractor(texts, {
      pooling: 'mean',
      normalize: true,
    });
    
    return output.tolist();
  }

  public async ingest(documents: any[]): Promise<void> {
    // 1. Extract texts from documents
    const texts = documents.map(doc => doc.text);
    
    // 2. Create vectors using the private method
    const vectors = await this.createEmbeddings(texts);

    // 3. Prepare data for the JSON file
    const data = documents.map((doc, index) => ({
      id: doc.id,
      text: doc.text,
      metadata: doc.metadata,
      vector: vectors[index],
    }));

    // 4. Save the data to the local file
    writeFileSync(VECTORS_FILE, JSON.stringify(data, null, 2));
  }

  public async loadVectors(): Promise<any[]> {
    if (!existsSync(VECTORS_FILE)) {
      return [];
    }
    const data = readFileSync(VECTORS_FILE, 'utf-8');
    return JSON.parse(data);
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