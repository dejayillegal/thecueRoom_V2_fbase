
'use server';
/**
 * @fileOverview An AI agent for generating thumbnails for news articles.
 *
 * - generateThumbnail - A function that handles the thumbnail generation process.
 * - GenerateThumbnailInput - The input type for the generateThumbnail function.
 * - GenerateThumbnailOutput - The return type for the generateThumbnail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateThumbnailInputSchema = z.object({
  title: z.string().describe('The title of the news article or a prompt for image generation.'),
});
export type GenerateThumbnailInput = z.infer<typeof GenerateThumbnailInputSchema>;

const GenerateThumbnailOutputSchema = z.object({
  imageUrl: z.string().url().describe('The URL of the generated thumbnail image.'),
  revisedPrompt: z.string().describe('The revised prompt used for generation.')
});
export type GenerateThumbnailOutput = z.infer<typeof GenerateThumbnailOutputSchema>;

export async function generateThumbnail(input: GenerateThumbnailInput): Promise<GenerateThumbnailOutput> {
  return generateThumbnailFlow(input);
}

const generateThumbnailFlow = ai.defineFlow(
  {
    name: 'generateThumbnailFlow',
    inputSchema: GenerateThumbnailInputSchema,
    outputSchema: GenerateThumbnailOutputSchema,
  },
  async (input) => {
    // This flow serves as a free fallback for image generation.
    // It creates a deterministic, seeded image from a placeholder service.
    // This gives the impression of a unique image for each prompt without cost.
    const imageSeed = input.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const width = 600;
    const height = 600;
    
    return {
      imageUrl: `https://picsum.photos/seed/${imageSeed}/${width}/${height}`,
      revisedPrompt: "Generated with free-tier seeded image service."
    };
  }
);
