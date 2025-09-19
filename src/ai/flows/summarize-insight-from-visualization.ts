'use server';
/**
 * @fileOverview A flow that summarizes the insight from a given visualization.
 *
 * - summarizeInsightFromVisualization - A function that handles the summarization process.
 * - SummarizeInsightFromVisualizationInput - The input type for the summarizeInsightFromVisualization function.
 * - SummarizeInsightFromVisualizationOutput - The return type for the summarizeInsightFromVisualization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeInsightFromVisualizationInputSchema = z.object({
  title: z.string().describe('The title of the visualization.'),
  sqlQuery: z.string().describe('The SQL query used to generate the visualization.'),
  dataDescription: z.string().describe('A description of the data being visualized, including the columns and their meanings.'),
});
export type SummarizeInsightFromVisualizationInput = z.infer<typeof SummarizeInsightFromVisualizationInputSchema>;

const SummarizeInsightFromVisualizationOutputSchema = z.object({
  summary: z.string().describe('A short, one-sentence summary of the insight conveyed by the visualization.'),
});
export type SummarizeInsightFromVisualizationOutput = z.infer<typeof SummarizeInsightFromVisualizationOutputSchema>;

export async function summarizeInsightFromVisualization(input: SummarizeInsightFromVisualizationInput): Promise<SummarizeInsightFromVisualizationOutput> {
  return summarizeInsightFromVisualizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeInsightFromVisualizationPrompt',
  input: {schema: SummarizeInsightFromVisualizationInputSchema},
  output: {schema: SummarizeInsightFromVisualizationOutputSchema},
  prompt: `You are an expert in data analysis and visualization.

You are given the title of a visualization, the SQL query used to generate it, and a description of the data being visualized.

Your task is to provide a short, one-sentence summary of the key insight conveyed by the visualization.

Title: {{{title}}}
SQL Query: {{{sqlQuery}}}
Data Description: {{{dataDescription}}}

Summary: `,
});

const summarizeInsightFromVisualizationFlow = ai.defineFlow(
  {
    name: 'summarizeInsightFromVisualizationFlow',
    inputSchema: SummarizeInsightFromVisualizationInputSchema,
    outputSchema: SummarizeInsightFromVisualizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
