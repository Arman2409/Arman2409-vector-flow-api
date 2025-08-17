export interface Document {
    id: string;
    text: string;
    metadata?: Record<string, string>;
}

export interface VectorDocument extends Document {
    vector: number[][];
}

export interface VectorDocumentScored extends VectorDocument{
    score: number;
}

export interface IngestDocumentsResult {
  documentCount: number;
  chunkCount: number;
  elapsedMs: number;
}