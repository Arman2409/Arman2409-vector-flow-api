import { z } from 'zod';

const metadataSchema = z.record(z.string(), z.string()).optional();

const documentSchema = z.object({
  id: z.string().nonempty('"id" field can not be empty'),
  text: z.string().nonempty('"text" field ca nnot be empty'),
  metadata: metadataSchema.optional(),
});

export const ingestManyBodySchema = z.array(documentSchema);

export type IngestManyBody = z.infer<typeof ingestManyBodySchema>;