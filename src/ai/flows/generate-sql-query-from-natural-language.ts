'use server';
/**
 * @fileOverview This file defines a Genkit flow to generate SQL queries from natural language input.
 *
 * - generateSqlQuery - A function that takes natural language input and returns an SQL query.
 * - GenerateSqlQueryInput - The input type for the generateSqlQuery function.
 * - GenerateSqlQueryOutput - The return type for the generateSqlQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSqlQueryInputSchema = z.object({
  naturalLanguageQuery: z
    .string()
    .describe('The natural language query to translate to SQL.'),
  tableSchema: z
    .string()
    .describe('The schema of the SQL table to query against.'),
});
export type GenerateSqlQueryInput = z.infer<typeof GenerateSqlQueryInputSchema>;

const GenerateSqlQueryOutputSchema = z.object({
  sqlQuery: z.string().describe('The generated SQL query.'),
});
export type GenerateSqlQueryOutput = z.infer<typeof GenerateSqlQueryOutputSchema>;

export async function generateSqlQuery(input: GenerateSqlQueryInput): Promise<GenerateSqlQueryOutput> {
  return generateSqlQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSqlQueryPrompt',
  input: {schema: GenerateSqlQueryInputSchema},
  output: {schema: GenerateSqlQueryOutputSchema},
  prompt: `You are an expert SQL query generator. Given a natural language query and a table schema, you will generate the SQL query that answers the natural language query.

Natural Language Query: {{{naturalLanguageQuery}}}

Table Schema: {{{tableSchema}}}

SQL Query: `,
});

const generateSqlQueryFlow = ai.defineFlow(
  {
    name: 'generateSqlQueryFlow',
    inputSchema: GenerateSqlQueryInputSchema,
    outputSchema: GenerateSqlQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
