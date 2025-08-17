import { z } from 'zod';

const metadataSchema = z.record(z.string(), z.string()).optional();

const documentSchema = z.object({
  id: z.string().nonempty('ID cannot be empty'),
  text: z.string().nonempty('Text cannot be empty'),
  metadata: metadataSchema.optional(),
});

export const ingestManyBodySchema = z.array(documentSchema);