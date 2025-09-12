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
  artistName: z.string().optional().describe('Optional: The name of the artist to be included in the cover art.'),
  albumName: z.string().optional().describe('Optional: The name of the album or track to be included in the cover art.'),
  releaseLabel: z.string().optional().describe('Optional: The name of the release label to be included in the cover art.'),
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

const artDirectorPrompt = ai.definePrompt({
  name: 'generateCoverArtArtDirectorPrompt',
  input: {schema: z.object({ prompt: z.string() })},
  prompt: `You are a visionary AI art director for an underground music collective called "thecueRoom". Your task is to expand on a user's creative concept and generate a detailed, descriptive prompt for an image generation model. This new prompt must strictly adhere to the established visual identity.

  ${styleGuidance}

  **User's Creative Concept:**
  {{{prompt}}}

  Based on the user's concept and the style guidelines, create a rich, detailed paragraph that describes the desired image. This description will be used by another AI to generate the final artwork. It should be evocative and specific, guiding the image model to produce a powerful and creative piece of art that would fit perfectly on a vinyl record sleeve for a cutting-edge electronic music release.
  `,
});

const generateCoverArtFlow = ai.defineFlow(
  {
    name: 'generateCoverArtFlow',
    inputSchema: GenerateCoverArtInputSchema,
    outputSchema: GenerateCoverArtOutputSchema,
  },
  async (input) => {
    // NOTE: The following section is commented out to prevent API errors related to billing.
    // To enable real image generation, you must enable billing for your project in the Google Cloud Console
    // and then uncomment the code below.

    // // Step 1: Have an LLM act as an "art director" to expand the user's prompt
    // const directorResponse = await artDirectorPrompt({ prompt: input.prompt });
    // const revisedPrompt = directorResponse.text;

    // // Step 2: Use the detailed prompt to generate the base image
    // const { media: baseImage } = await ai.generate({
    //   model: 'googleai/imagen-4.0-fast-generate-001',
    //   prompt: revisedPrompt,
    //   config: {
    //     aspectRatio: input.aspectRatio,
    //   }
    // });

    // if (!baseImage?.url) {
    //   throw new Error("Base image generation failed.");
    // }

    // // Step 3: If text is provided, use a multimodal model to add text and watermark
    // const hasText = input.artistName || input.albumName || input.releaseLabel;
    // if (hasText) {
    //   const textPromptParts = [
    //     { media: { url: baseImage.url } },
    //     { text: `You are a graphic designer for an underground music label. Your task is to add text to this album cover in a way that is artistic, subtle, and integrated with the existing abstract artwork. Adhere to these rules:
    //       - The typography should be clean, minimalist, and modern. San-serif fonts are preferred.
    //       - Do NOT obscure the main focal point of the artwork. Place the text thoughtfully in areas of negative space.
    //       - The text color should complement the artwork's palette. It can be white, a muted tone from the image, or the artwork's accent color.
    //       - Add a very small, subtle, semi-transparent watermark in the bottom right corner that says: "thecueRoom AI". Make it discreet and professional.`},
    //   ];

    //   if (input.artistName) textPromptParts.push({ text: `Artist Name: ${input.artistName}` });
    //   if (input.albumName) textPromptParts.push({ text: `Album/Track Name: ${input.albumName}` });
    //   if (input.releaseLabel) textPromptParts.push({ text: `Label: ${input.releaseLabel}` });
      
    //   textPromptParts.push({text: "Apply the text and watermark as requested."})

    //   const { media: finalImage } = await ai.generate({
    //       model: 'googleai/gemini-2.5-flash-image-preview',
    //       prompt: textPromptParts,
    //       config: {
    //           responseModalities: ['IMAGE'],
    //       },
    //   });

    //   if (!finalImage?.url) {
    //     throw new Error("Failed to add text and watermark to the image.");
    //   }

    //    return { 
    //     imageUrl: finalImage.url,
    //     revisedPrompt: revisedPrompt || "No revision needed." 
    //   };

    // }
    
    // // If no text, return the base image
    // return { 
    //   imageUrl: baseImage.url,
    //   revisedPrompt: revisedPrompt || "No revision needed." 
    // };

    // Fallback to placeholder image generation
    const imageSeed = input.prompt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const [width, height] = input.aspectRatio === '16:9' ? [640, 360] : input.aspectRatio === '9:16' ? [360, 640] : [600, 600];

    return {
      imageUrl: `https://picsum.photos/seed/${imageSeed}/${width}/${height}`,
      revisedPrompt: "Placeholder generated. Enable billing in Google Cloud to use Imagen for real cover art."
    };
  }
);
