
import { z } from "zod";

export const NewsItemSchema = z.object({
  title: z.string().min(3),
  url: z.string().url(),
  source: z.string().min(2),
  category: z.string().min(2),
  region: z.string().min(2),
  publishedAt: z.coerce.date(), // accepts string/number/Date -> Date
  image: z.string().url().nullable().optional(),
});

export type NewsItem = z.infer<typeof NewsItemSchema>;

export const NewsSettingsSchema = z.object({
  GLOBAL_TIMEOUT_MS: z.number().int().positive(),
  SOURCE_TIMEOUT_MS: z.number().int().positive(),
  FETCH_CONCURRENCY: z.number().int().min(1).max(16),
  STALE_FALLBACK_MS: z.number().int().positive(),
  MAX_PER_SOURCE: z.number().int().min(1).max(50),
});

export type NewsSettings = z.infer<typeof NewsSettingsSchema>;

// This type is maintained for the Admin page client-side form
export type RssFeed = {
  category: string;
  region: string;
  name: string;
  url: string;
  notes?: string;
};
