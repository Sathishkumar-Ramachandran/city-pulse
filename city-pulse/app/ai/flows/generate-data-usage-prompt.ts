'use server';

/**
 * @fileOverview A Genkit flow for generating a Data Usage Prompt using GenAI.
 *
 * - generateDataUsagePrompt - A function that generates a data usage prompt based on input data source details.
 * - GenerateDataUsagePromptInput - The input type for the generateDataUsagePrompt function.
 * - GenerateDataUsagePromptOutput - The return type for the generateDataUsagePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDataUsagePromptInputSchema = z.object({
  domain: z.string().describe('The domain of the data source (e.g., traffic, infrastructure).'),
  endpointId: z.string().describe('Unique identifier for the API endpoint.'),
  schema: z.string().describe('Data schema of the API response.'),
  source: z.string().describe('Source of the data (e.g., API provider).'),
  isTransformationRequired: z
    .boolean()
    .describe('Boolean flag indicating if data transformation is needed.'),
  isAttachment: z.boolean().describe('Boolean flag indicating if the endpoint returns an attachment.'),
  attachmentType: z.string().describe('Type of attachment (e.g., PDF, Excel, CSV, Parquet).'),
  ingestionType: z
    .string()
    .describe('Type of data ingestion (RestAPI, Streaming, Webhooks).'),
  tableName: z.string().describe('Name of the SQL table to store the data.'),
  dataUsageInstructions: z.string().describe('Specific instructions on how to use the data.'),
  dataUsers: z
    .string()
    .describe(
      'List of users or groups authorized to access the data (e.g., Administrators/Governance, Users).'
    ),
});
export type GenerateDataUsagePromptInput = z.infer<typeof GenerateDataUsagePromptInputSchema>;

const GenerateDataUsagePromptOutputSchema = z.object({
  dataUsagePrompt: z.string().describe('A prompt for AI agents to label and understand the data.'),
});
export type GenerateDataUsagePromptOutput = z.infer<typeof GenerateDataUsagePromptOutputSchema>;

export async function generateDataUsagePrompt(
  input: GenerateDataUsagePromptInput
): Promise<GenerateDataUsagePromptOutput> {
  return generateDataUsagePromptFlow(input);
}

const generateDataUsagePromptPrompt = ai.definePrompt({
  name: 'generateDataUsagePromptPrompt',
  input: {schema: GenerateDataUsagePromptInputSchema},
  output: {schema: GenerateDataUsagePromptOutputSchema},
  prompt: `You are an expert data curator. Your task is to generate a Data Usage Prompt for AI agents to effectively label and understand data from various sources.

  Here are the details of the data source:

  Domain: {{{domain}}}
  Endpoint ID: {{{endpointId}}}
  Schema: {{{schema}}}
  Source: {{{source}}}
  Is Transformation Required: {{{isTransformationRequired}}}
  Is Attachment: {{{isAttachment}}}
  Attachment Type: {{{attachmentType}}}
  Ingestion Type: {{{ingestionType}}}
  Table Name: {{{tableName}}}
  Data Usage Instructions: {{{dataUsageInstructions}}}
  Data Users: {{{dataUsers}}}

  Generate a concise and informative Data Usage Prompt that will help AI agents understand the data and use it effectively for various tasks.
  The prompt should guide the AI agent on how to label the data, extract relevant information, and use it in downstream applications.

  Data Usage Prompt:`,
});

const generateDataUsagePromptFlow = ai.defineFlow(
  {
    name: 'generateDataUsagePromptFlow',
    inputSchema: GenerateDataUsagePromptInputSchema,
    outputSchema: GenerateDataUsagePromptOutputSchema,
  },
  async input => {
    const {output} = await generateDataUsagePromptPrompt(input);
    return output!;
  }
);
