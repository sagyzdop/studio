'use server';
/**
 * @fileOverview A flow to suggest an appropriate chart type based on the data structure of the query results.
 *
 * - suggestChartType - A function that suggests a chart type.
 * - SuggestChartTypeInput - The input type for the suggestChartType function.
 * - SuggestChartTypeOutput - The return type for the suggestChartType function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestChartTypeInputSchema = z.object({
  data: z.array(z.record(z.any())).describe('The data from the SQL query.'),
});
export type SuggestChartTypeInput = z.infer<typeof SuggestChartTypeInputSchema>;

const SuggestChartTypeOutputSchema = z.object({
  chartType: z.string().describe('The suggested chart type.'),
  reason: z.string().describe('The reason for suggesting this chart type.'),
});
export type SuggestChartTypeOutput = z.infer<typeof SuggestChartTypeOutputSchema>;

export async function suggestChartType(input: SuggestChartTypeInput): Promise<SuggestChartTypeOutput> {
  return suggestChartTypeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestChartTypePrompt',
  input: {schema: SuggestChartTypeInputSchema},
  output: {schema: SuggestChartTypeOutputSchema},
  prompt: `You are an expert data visualization specialist. Given the following data structure, suggest an appropriate chart type and explain why.\n\nData: {{{JSON.stringify data}}}\n\nConsider these chart types: bar, line, pie, scatter, table.\n\nOutput the chartType and reason fields in JSON format. Be concise and to the point, using the descriptions in the schema to guide you.`,
});

const suggestChartTypeFlow = ai.defineFlow(
  {
    name: 'suggestChartTypeFlow',
    inputSchema: SuggestChartTypeInputSchema,
    outputSchema: SuggestChartTypeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
