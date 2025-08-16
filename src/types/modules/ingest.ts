export interface Document {
    id: string;
    text: string;
    metadata?: Record<string, string>;
}

export type IngestRequestPayload = Document[]