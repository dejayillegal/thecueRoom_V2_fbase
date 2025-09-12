'use server';
/**
 * @fileOverview An AI agent for generating cover art for music releases.
 *
 * - generateCoverArt - A function that handles the cover art generation process.
 * - GenerateCoverArtInput - The input type for the generateCoverArt function.
 * - GenerateCoverArtOutput - The return type for the generateCoverArt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCoverArtInputSchema = z.object({
  prompt: z.string().describe('The user\'s creative prompt for the cover art.'),
  aspectRatio: z.enum(['1:1', '16:9', '9:16']).default('1:1').describe('The desired aspect ratio for the generated image.'),
});
export type GenerateCoverArtInput = z.infer<typeof GenerateCoverArtInputSchema>;

const GenerateCoverArtOutputSchema = z.object({
  imageUrl: z.string().url().describe('The URL of the generated cover art image.'),
  revisedPrompt: z.string().describe('The revised full prompt sent to the generation model.'),
});
export type GenerateCoverArtOutput = z.infer<typeof GenerateCoverArtOutputSchema>;

// This is the function that will be called from the UI
export async function generateCoverArt(input: GenerateCoverArtInput): Promise<GenerateCoverArtOutput> {
  return generateCoverArtFlow(input);
}

const styleGuidance = `
  **Style Guidelines for thecueRoom Album Art:**
  - **Theme:** Dark, moody, atmospheric, and abstract. Evoke feelings of underground techno and house music scenes.
  - **Palette:** Primarily monochromatic with deep blacks, greys, and muted tones. Use a single, vibrant accent color (like neon green, electric blue, or magenta) sparingly for high impact.
  - **Composition:** Minimalist, often with a central focus or an intriguing pattern. Asymmetry is preferred. Negative space is a powerful tool.
  - **Texture:** Incorporate subtle textures like grain, static, glitch effects, or distressed elements to add depth and an analog feel.
  - **Avoid:** Bright, cheerful colors. Overly complex or cluttered scenes. Corporate or generic stock photo aesthetics. Literal interpretations.
`;

const prompt = ai.definePrompt({
  name: 'generateCoverArtPrompt',
  input: {schema: GenerateCoverArtInputSchema},
  prompt: `You are a visionary AI art director for an underground music collective called "thecueRoom". Your task is to generate a compelling, high-quality album cover based on a user's prompt, strictly adhering to the established visual identity.

  ${styleGuidance}

  **User's Creative Concept:**
  {{{prompt}}}

  Based on the user's concept and the style guidelines, create a single, powerful, and creative image. The final output must be a piece of art that would fit perfectly on a vinyl record sleeve for a cutting-edge electronic music release.
  `,
});


const generateCoverArtFlow = ai.defineFlow(
  {
    name: 'generateCoverArtFlow',
    inputSchema: GenerateCoverArtInputSchema,
    outputSchema: GenerateCoverArtOutputSchema,
  },
  async (input) => {
    // In a real implementation, you would use an image generation model.
    console.log("Generating image with prompt:", input.prompt);
    // For now, we'll return a placeholder to avoid calling a real model.
    // This demonstrates how the flow would work.
    
    // To use a real model, you would uncomment this:
    /*
    const llmResponse = await prompt(input);
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: llmResponse.output || input.prompt,
      config: {
        aspectRatio: input.aspectRatio,
      }
    });

    return { 
      imageUrl: media.url,
      revisedPrompt: llmResponse.output || "No revision needed." 
    };
    */
    
    // Placeholder logic for demonstration
    const imageSeed = input.prompt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    let width = 600;
    let height = 600;
    if (input.aspectRatio === '16:9') {
        width = 800;
        height = 450;
    } else if (input.aspectRatio === '9:16') {
        width = 450;
        height = 800;
    }

    const finalPrompt = `(thecueRoom style: dark, moody, abstract, underground music aesthetic) ${input.prompt}`;

    return {
      imageUrl: `https://picsum.photos/seed/${imageSeed}/${width}/${height}`,
      revisedPrompt: finalPrompt,
    };
  }
);
