
import { z } from "zod";

// Safe date preprocessor: any falsy/invalid becomes "now"
const SafeDate = z.preprocess((v) => {
  const d = v instanceof Date ? v : new Date(String(v));
  return isNaN(+d) ? new Date() : d;
}, z.date());

export const ArticleSchema = z.object({
  title: z.string().min(3),
  url: z.string().url(),
  source: z.string().min(2),
  category: z.enum(["Music", "Industry", "Guides", "Global Underground"]),
  region: z.enum(["India", "Asia", "Europe", "Global"]),
  publishedAt: SafeDate,
  image: z.string().url().optional(),  // if missing → simply omitted; never `undefined` when saved (see sanitizer)
  summary: z.string().optional(),
});
export type Article = z.infer<typeof ArticleSchema>;

export const ArticlesSchema = z.array(ArticleSchema);

export const FeedSourceSchema = z.object({
  name: z.string(),
  url: z.string(), // RSS or HTML index
  category: z.enum(["Music","Industry","Guides","Global Underground"]),
  region: z.enum(["India","Asia","Europe","Global"]),
});
export type FeedSource = z.infer<typeof FeedSourceSchema>;

export const CustomFeedsSchema = z.record(
  z.string(), // Category
  z.record(
    z.string(), // Region
    z.array(z.object({ name: z.string(), url: z.string().url() }))
  )
);

export const IngestNewsInputSchema = z.object({ force: z.boolean().optional() });
export type IngestNewsInput = z.infer<typeof IngestNewsInputSchema>;
export const IngestNewsOutputSchema = z.object({ articles: ArticlesSchema });
export type IngestNewsOutput = z.infer<typeof IngestNewsOutputSchema>;
