
import { z } from "zod";

export const ArticleSchema = z.object({
  title: z.string().min(3),
  url: z.string().url(),
  source: z.string().min(2),
  category: z.enum(["Music","Industry","Guides","Global Underground"]).catch("Music"),
  region: z.enum(["India","Asia","Europe","Global"]).catch("Global"),
  publishedAt: z.coerce.date(),
  image: z.string().url().optional(),
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

export const IngestNewsInputSchema = z.object({
  force: z.boolean().optional(),     // allow manual refresh from Admin later
});
export type IngestNewsInput = z.infer<typeof IngestNewsInputSchema>;

export const IngestNewsOutputSchema = z.object({
  articles: z.array(ArticleSchema),
});
export type IngestNewsOutput = z.infer<typeof IngestNewsOutputSchema>;
