import { z } from 'zod';
import { isValidObjectId } from 'mongoose';

export const promptBodySchema = z.object({
  prompt: z
    .string()
    .min(1, 'Prompt cannot be empty')
    .max(1000, 'Prompt cannot exceed 1000 characters'),
  stream: z.boolean().optional().default(false),
  chatId: z
    .string()
    .refine(val => isValidObjectId(val))
    .nullish()
});
