import { config } from 'dotenv';
config();

import '@/ai/flows/automate-data-extraction.ts';
import '@/ai/flows/extract-api-metadata.ts';
import '@/ai/flows/generate-data-usage-prompt.ts';
import '@/ai/flows/transform-data-with-llm.ts';
import '@/ai/flows/geocode-address.ts';
