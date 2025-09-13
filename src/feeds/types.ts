import { z } from "zod";

export const NewsItemSchema = z.object({
  title: z.string().min(3),
  url: z.string().url(),
  source: z.string().min(2),
  category: z.string().min(2),
  region: z.string().min(2),
  publishedAt: z.coerce.date(),
  image: z.string().url().nullable().optional(),
});

export type NewsItem = z.infer<typeof NewsItemSchema>;

export type IngestNewsInput = { force?: boolean };
export type IngestNewsOutput = { articles: NewsItem[] };
