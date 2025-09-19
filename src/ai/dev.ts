import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-insight-from-visualization.ts';
import '@/ai/flows/suggest-chart-type-from-data.ts';
import '@/ai/flows/generate-sql-query-from-natural-language.ts';