
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
        { title: "Berghain announces extended Sunday sessions", source: "Resident Advisor", url: "https://example.com/berghain" },
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
            { title: "Berghain announces extended Sunday sessions for the summer", source: "Resident Advisor", url: "https://ra.co/news/77519", category: "Global Underground", publishedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
            { title: "XLR8R+042: A New Compilation Featuring 10 Exclusive Tracks", source: "XLR8R", url: "https://xlr8r.com/news/xlr8r-042-a-new-compilation/", category: "Global Underground", publishedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString() },
            { title: "Ableton releases new spectral processing device 'Spectra'", source: "Ableton Blog", url: "https://www.ableton.com/en/blog/new-spectral-processing-device/", category: "Gear / Production", publishedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString() },
            { title: "Wild City spotlights new talent from Mumbai in their latest mix", source: "Wild City", url: "https://wildcity.in/news/1234-new-talent-from-mumbai", category: "India / Asia Underground", publishedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString() },
            { title: "Mixmag premieres a hypnotic new track from a rising techno star", source: "Mixmag", url: "https://mixmag.net/feature/premiere-new-track-rising-star", category: "Global Underground", publishedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString() },
            { title: "Dekmantel launches a new podcast series focusing on ambient music", source: "Dekmantel", url: "https://dekmantel.com/podcast/new-series-ambient", category: "Mixes / Podcasts", publishedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString() },
            { title: "Bandcamp Daily: The Best Electronic Music of the Month", source: "Bandcamp Daily", url: "https://daily.bandcamp.com/best-electronic-music-may-2024", category: "Labels / Platforms", publishedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString() },
            { title: "FACT Magazine reviews the latest Moog synthesizer", source: "FACT Magazine", url: "https://www.factmag.com/2024/05/10/moog-synthesizer-review/", category: "Gear / Production", publishedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString() },
            { title: "The Indian Music Diaries: In conversation with producer Lifafa", source: "The Indian Music Diaries", url: "https://theindianmusicdiaries.com/lifafa-interview/", category: "India / Asia Underground", publishedAt: new Date(Date.now() - 5 * 24 * 36G00 * 1000).toISOString() },
            { title: "XLR8R Podcast 785: Ben UFO", source: "XLR8R", url: "https://xlr8r.com/podcasts/xlr8r-podcast-785-ben-ufo/", category: "Mixes / Podcasts", publishedAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString() },
        ]
    };
  }
);
