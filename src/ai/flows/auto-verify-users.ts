'use server';

/**
 * @fileOverview A user auto-verification AI agent.
 *
 * - autoVerifyUsers - A function that handles the user auto-verification process.
 * - AutoVerifyUsersInput - The input type for the autoVerifyUsers function.
 * - AutoVerifyUsersOutput - The return type for the autoVerifyUsers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoVerifyUsersInputSchema = z.object({
  profileUrls: z.array(z.string().url()).describe('An array of profile URLs provided by the user during signup (SoundCloud, Beatport, Instagram, RA, label/collective links).'),
  contentPatterns: z.string().describe('A string containing content patterns identified in the user provided content.'),
});
export type AutoVerifyUsersInput = z.infer<typeof AutoVerifyUsersInputSchema>;

const AutoVerifyUsersOutputSchema = z.object({
  isVerified: z.boolean().describe('Whether or not the user should be automatically verified based on the provided information.'),
  reason: z.string().describe('The reason for the verification decision.'),
});
export type AutoVerifyUsersOutput = z.infer<typeof AutoVerifyUsersOutputSchema>;

export async function autoVerifyUsers(input: AutoVerifyUsersInput): Promise<AutoVerifyUsersOutput> {
  return autoVerifyUsersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoVerifyUsersPrompt',
  input: {schema: AutoVerifyUsersInputSchema},
  output: {schema: AutoVerifyUsersOutputSchema},
  prompt: `You are an expert in identifying legitimate music artists and DJs within the techno and house music scene.

You will receive a list of profile URLs and content patterns provided by a user during signup. Your task is to determine whether the user should be automatically verified based on this information.

Consider the following factors:
- The presence of links to established platforms like SoundCloud, Beatport, Resident Advisor (RA), and reputable labels or collectives.
- The relevance of the content patterns to techno and house music (e.g., mentions of genres, artists, events, labels).
- The overall professionalism and credibility of the user's online presence.

Based on your analysis, determine whether the user should be automatically verified. If so, set the isVerified output field to true and provide a brief reason for your decision. If not, set isVerified to false and explain why the user could not be automatically verified.

Profile URLs:
{{#each profileUrls}}
- {{{this}}}
{{/each}}

Content Patterns: {{{contentPatterns}}}
`,
});

const autoVerifyUsersFlow = ai.defineFlow(
  {
    name: 'autoVerifyUsersFlow',
    inputSchema: AutoVerifyUsersInputSchema,
    outputSchema: AutoVerifyUsersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
