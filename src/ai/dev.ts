
import { config } from 'dotenv';
config();

import '@/ai/flows/auto-verify-users.ts';
import '@/ai/flows/ingest-news.ts';
import '@/ai/flows/generate-thumbnail.ts';
import '@/ai/flows/generate-cover-art.ts';
import '@/ai/flows/get-set-cover-art-config.ts';
