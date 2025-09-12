
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

const IngestNewsOutputSchema = z.object({
  articles: z.array(ArticleSchema).describe('An array of ingested news articles, de-duplicated and categorized.'),
});
export type IngestNewsOutput = z.infer<typeof IngestNewsOutputSchema>;

export async function ingestNews(input: IngestNewsInput): Promise<IngestNewsOutput> {
  return ingestNewsFlow(input);
}

// Placeholder tool for fetching RSS feed content.
// In a real implementation, this would fetch and parse the RSS feed.
const fetchRssContentTool = ai.defineTool(
    {
        name: 'fetchRssContent',
        description: 'Fetches and parses content from a list of RSS feed URLs.',
        inputSchema: z.object({
            urls: z.array(z.string().url()),
        }),
        outputSchema: z.object({
            // This is a simplified representation. A real implementation would
            // have a more detailed structure for RSS feed items.
            items: z.array(z.object({
                title: z.string(),
                url: z.string().url(),
                source: z.string(),
                publishedAt: z.string().datetime().optional(),
            })),
        }),
    },
    async ({ urls }) => {
        console.log(`Fetching content for ${urls.length} URLs...`);
        // In a real application, you would implement the logic to fetch and parse
        // the RSS feeds here. For now, we'll return mock data.
        return {
            items: [
                { title: 'Mock Article 1', url: 'https://example.com/1', source: 'Mock Source', publishedAt: new Date().toISOString() },
                { title: 'Mock Article 2', url: 'https://example.com/2', source: 'Mock Source', publishedAt: new Date().toISOString() },
            ],
        };
    }
);


const prompt = ai.definePrompt({
  name: 'ingestNewsPrompt',
  input: { schema: IngestNewsInputSchema },
  output: { schema: IngestNewsOutputSchema },
  tools: [fetchRssContentTool],
  prompt: `You are a news curator for 'thecueRoom', a community for underground music artists.

Your task is to process a list of articles from various RSS feeds, categorize them, and remove duplicates.

1.  You will be provided with a list of RSS feeds grouped by category.
2.  Use the 'fetchRssContent' tool to get the articles from these feeds.
3.  Analyze the fetched articles.
4.  Filter out any articles that are not relevant to the underground electronic music scene (techno, house, etc.), gear/production, or the specified music culture.
5.  Remove any duplicate articles, keeping the one from the most reputable source.
6.  Format the final list of articles according to the output schema.

Categories to process:
{{#if categories}}
{{#each categories}}
- {{{this}}}
{{/each}}
{{else}}
All categories.
{{/if}}
`,
});

const ingestNewsFlow = ai.defineFlow(
  {
    name: 'ingestNewsFlow',
    inputSchema: IngestNewsInputSchema,
    outputSchema: IngestNewsOutputSchema,
  },
  async (input) => {
    // In a real implementation, you would filter rssFeeds based on input.categories
    // and pass the URLs to the fetchRssContentTool.
    const urlsToFetch = rssFeeds.slice(0, 5).map(feed => feed.url); // Example: Fetch first 5 feeds

    const llmResponse = await prompt(input, {
        tools: [
            {
                tool: fetchRssContentTool,
                args: { urls: urlsToFetch }
            }
        ]
    });

    // For this placeholder, we return a static response.
    // The actual implementation would process llmResponse.output.
    return {
        articles: [
            { title: "Berghain announces extended Sunday sessions", source: "Resident Advisor", url: "#", category: "Global Underground" },
            { title: "Detroit mainstay drops surprise vinyl-only EP", source: "XLR8R", url: "#", category: "Global Underground" },
        ]
    };
  }
);
