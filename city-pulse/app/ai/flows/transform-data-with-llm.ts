'use server';
/**
 * @fileOverview A data transformation AI agent that generates a Python script to transform ingested data based on a user-provided prompt, 
 * potentially leveraging LLMs for language translation or data extraction.
 *
 * - transformData - A function that handles the data transformation process.
 * - TransformDataInput - The input type for the transformData function.
 * - TransformDataOutput - The return type for the transformData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransformDataInputSchema = z.object({
  ingestedDataSchema: z.string().describe('The schema of the ingested data as a string.'),
  transformationPrompt: z.string().describe('A prompt describing how to transform the ingested data.'),
});
export type TransformDataInput = z.infer<typeof TransformDataInputSchema>;

const TransformDataOutputSchema = z.object({
  pythonScript: z.string().describe('The generated Python script for data transformation.'),
});
export type TransformDataOutput = z.infer<typeof TransformDataOutputSchema>;

export async function transformData(input: TransformDataInput): Promise<TransformDataOutput> {
  return transformDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transformDataPrompt',
  input: {schema: TransformDataInputSchema},
  output: {schema: TransformDataOutputSchema},
  prompt: `You are an AI data transformation expert. Based on the provided data schema and transformation prompt, generate a Python script using Pandas/NumPy to transform the data.

Data Schema: {{{ingestedDataSchema}}}
Transformation Prompt: {{{transformationPrompt}}}

Ensure the script is well-documented and handles potential errors. If the transformation prompt requires language translation or data extraction from files, use appropriate LLM libraries or file processing techniques in the Python script.

Your response should only be the Python script. Do not include any other text or explanations.
`,
});

const transformDataFlow = ai.defineFlow(
  {
    name: 'transformDataFlow',
    inputSchema: TransformDataInputSchema,
    outputSchema: TransformDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
