
'use server';
/**
 * @fileOverview A news ingestion AI agent.
 *
 * - ingestNews - A function that handles the news ingestion process.
 * - IngestNewsInput - The input type for the ingestNews function.
 * - IngestNewsOutput - The return type for the ingestNews function.
 */

import { ai } from '@/ai/genkit';
import { rssFeeds } from '@/lib/rss-feeds';
import { z } from 'genkit';

const IngestNewsInputSchema = z.object({
  categories: z.array(z.string()).optional().describe('An array of categories to ingest news from. If not provided, all categories will be used.'),
});
export type IngestNewsInput = z.infer<typeof IngestNewsInputSchema>;

const ArticleSchema = z.object({
  title: z.string().describe('The title of the news article.'),
  url: z.string().url().describe('The URL of the news article.'),
  source: z.string().describe('The name of the news source.'),
  category: z.string().describe('The category of the news article.'),
  publishedAt: z.string().datetime().optional().describe('The publication date of the article.'),
});
export type Article = z.infer<typeof ArticleSchema>;

const IngestNewsOutputSchema = z.object({
  articles: z.array(ArticleSchema).describe('An array of ingested news articles, de-duplicated and categorized.'),
});
export type IngestNewsOutput = z.infer<typeof IngestNewsOutputSchema>;

export async function ingestNews(input: IngestNewsInput): Promise<IngestNewsOutput> {
  return ingestNewsFlow(input);
}

// This is a placeholder for a real RSS feed fetching implementation.
async function fetchAndParseFeeds(categories?: string[]): Promise<any[]> {
    console.log("Fetching mock feed content...");
    // In a real app, you'd filter rssFeeds by categories and fetch/parse them.
    // For now, we return a mock array of articles.
    return [
        { title: "Mock Article 1 from fetcher", url: "https://example.com/1", source: "Mock Source" },
        { title: "Mock Article 2 from fetcher", url: "https://example.com/2", source: "Mock Source" },
        { title: "Berghain announces extended Sunday sessions", source: "Resident Advisor", url: "#" },
    ];
}


const prompt = ai.definePrompt({
  name: 'ingestNewsPrompt',
  input: { schema: z.object({
    articles: z.array(z.any()),
    categories: z.array(z.string()).optional(),
  }) },
  output: { schema: IngestNewsOutputSchema },
  prompt: `You are a news curator for 'thecueRoom', a community for underground music artists.

Your task is to process a list of articles, categorize them, and remove duplicates.

1.  You will be provided with a list of articles.
2.  Analyze the articles.
3.  Filter out any articles that are not relevant to the underground electronic music scene (techno, house, etc.), gear/production, or the specified music culture.
4.  Remove any duplicate articles, keeping the one from the most reputable source.
5.  Assign each article to its most relevant category.
6.  Format the final list of articles according to the output schema.

Articles to process:
{{{jsonStringify articles}}}
`,
});

const ingestNewsFlow = ai.defineFlow(
  {
    name: 'ingestNewsFlow',
    inputSchema: IngestNewsInputSchema,
    outputSchema: IngestNewsOutputSchema,
  },
  async (input) => {
    // In a real implementation, you would fetch and parse RSS feeds here.
    // const fetchedArticles = await fetchAndParseFeeds(input.categories);

    // const llmResponse = await prompt({
    //     articles: fetchedArticles,
    //     categories: input.categories
    // });
    // return llmResponse.output!;

    // For this placeholder, we return a static response to avoid unnecessary LLM calls.
    // The structure above shows how you would use the prompt in a real scenario.
    return {
        articles: [
            { title: "Berghain announces extended Sunday sessions", source: "Resident Advisor", url: "#", category: "Global Underground", publishedAt: new Date().toISOString() },
            { title: "Detroit mainstay drops surprise vinyl-only EP", source: "XLR8R", url: "#", category: "Global Underground", publishedAt: new Date().toISOString() },
            { title: "Ableton releases new spectral processing device", source: "Ableton Blog", url: "#", category: "Gear / Production", publishedAt: new Date().toISOString() },
            { title: "Wild City spotlights new talent from Mumbai", source: "Wild City", url: "#", category: "India / Asia Underground", publishedAt: new Date().toISOString() },
            { title: "Mixmag premieres a new track from a rising star", source: "Mixmag", url: "#", category: "Global Underground", publishedAt: new Date().toISOString() },
        ]
    };
  }
);
