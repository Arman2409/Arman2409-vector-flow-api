import { z } from 'zod';

export const askBodySchema = z.object({
  query: z.string(),
  topK: z.number().int().min(1).max(10),
  maxTokens: z.number().int().min(50).max(200)
});

export type AskBody = z.infer<typeof askBodySchema>;