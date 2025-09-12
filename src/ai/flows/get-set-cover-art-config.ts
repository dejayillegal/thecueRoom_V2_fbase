
'use server';
/**
 * @fileOverview Manages the configuration for the Cover Art Generator.
 *
 * - getCoverArtConfig - Retrieves the current configuration.
 * - setCoverArtConfig - Updates the configuration.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CoverArtConfigSchema = z.object({
  model: z.enum(['premium', 'free']).default('free'),
});

type CoverArtConfig = z.infer<typeof CoverArtConfigSchema>;

// In-memory store for the configuration.
// In a real application, you would replace this with a database (e.g., Firestore).
let currentConfig: CoverArtConfig = { model: 'free' };

export const getCoverArtConfigFlow = ai.defineFlow(
  {
    name: 'getCoverArtConfigFlow',
    outputSchema: CoverArtConfigSchema,
  },
  async () => {
    console.log('Getting config:', currentConfig);
    return currentConfig;
  }
);

export const setCoverArtConfigFlow = ai.defineFlow(
  {
    name: 'setCoverArtConfigFlow',
    inputSchema: CoverArtConfigSchema,
    outputSchema: CoverArtConfigSchema,
  },
  async (newConfig) => {
    console.log('Setting config to:', newConfig);
    currentConfig = newConfig;
    return currentConfig;
  }
);

// Export wrapper functions to be used by server actions
export async function getCoverArtConfig(): Promise<CoverArtConfig> {
  return getCoverArtConfigFlow();
}

export async function setCoverArtConfig(newConfig: CoverArtConfig): Promise<CoverArtConfig> {
  return setCoverArtConfigFlow(newConfig);
}
