import { z } from 'zod';

export const askBodySchema = z.object({
  query: z.string(),
  topK: z.number().int().min(1).max(10).optional(),
  maxTokens: z.number().int().min(50).max(200).optional(),
});

export type AskBody = z.infer<typeof askBodySchema>;