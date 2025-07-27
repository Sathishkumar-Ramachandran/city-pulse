'use server';

/**
 * @fileOverview An AI agent that extracts API metadata from a data source description.
 *
 * - extractApiMetadata - A function that handles the API metadata extraction process.
 * - ExtractApiMetadataInput - The input type for the extractApiMetadata function.
 * - ExtractApiMetadataOutput - The return type for the extractApiMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractApiMetadataInputSchema = z.object({
  description: z
    .string()
    .describe('A description of the data source and its details.'),
});
export type ExtractApiMetadataInput = z.infer<typeof ExtractApiMetadataInputSchema>;

const ExtractApiMetadataOutputSchema = z.object({
  endpoint_id: z.string().describe('Unique identifier for the API endpoint.'),
  schema: z.string().describe('Data schema of the API response.'),
  source: z.string().describe('Source of the data (e.g., API provider).'),
  is_transformation_required: z
    .boolean()
    .describe('Boolean flag indicating if data transformation is needed.'),
  is_attachment: z.boolean().describe('Boolean flag indicating if the endpoint returns an attachment.'),
  attachment_type: z.string().describe('Type of attachment (e.g., PDF, Excel, CSV, Parquet).'),
  ingestion_type: z
    .enum(['RestAPI', 'Streaming', 'Webhooks'])
    .describe('Type of data ingestion (RestAPI, Streaming, Webhooks).'),
  table_name: z.string().describe('Name of the SQL table to store the data.'),
  Data_Usage_Instructions: z.string().describe('Specific instructions on how to use the data.'),
  Data_Usage_Prompt: z.string().describe('Prompt for AI agents to label and understand the data.'),
  Data_Users: z
    .array(z.string())
    .describe('List of users or groups authorized to access the data (e.g., Administrators/Governance, Users).'),
});
export type ExtractApiMetadataOutput = z.infer<typeof ExtractApiMetadataOutputSchema>;

export async function extractApiMetadata(input: ExtractApiMetadataInput): Promise<ExtractApiMetadataOutput> {
  return extractApiMetadataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractApiMetadataPrompt',
  input: {schema: ExtractApiMetadataInputSchema},
  output: {schema: ExtractApiMetadataOutputSchema},
  prompt: `You are an expert data engineer specializing in data ingestion and API metadata extraction.

  Given the following description of a data source, extract the necessary API metadata in JSON format. Ensure that all fields are populated based on the provided description.

  Description: {{{description}}}

  Return the API metadata in the following JSON format:
  {
    "endpoint_id": "Unique identifier for the API endpoint",
    "schema": "Data schema of the API response",
    "source": "Source of the data (e.g., API provider)",
    "is_transformation_required": true or false,
    "is_attachment": true or false,
    "attachment_type": "Type of attachment (e.g., PDF, Excel, CSV, Parquet)",
    "ingestion_type": "RestAPI, Streaming, or Webhooks",
    "table_name": "Name of the SQL table to store the data",
    "Data_Usage_Instructions": "Specific instructions on how to use the data",
    "Data_Usage_Prompt": "Prompt for AI agents to label and understand the data",
    "Data_Users": ["List of users or groups authorized to access the data (e.g., Administrators/Governance, Users"]
  }`,
});

const extractApiMetadataFlow = ai.defineFlow(
  {
    name: 'extractApiMetadataFlow',
    inputSchema: ExtractApiMetadataInputSchema,
    outputSchema: ExtractApiMetadataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
