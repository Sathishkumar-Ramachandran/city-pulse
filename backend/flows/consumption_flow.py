import genkit
import json
from genkit.google_ai import google_ai
from pydantic import BaseModel, Field
from typing import Dict, Any

# Pydantic model for the flow's input
class SummarizeRecordInput(BaseModel):
    uuid: str
    tableName: str
    data: Dict[str, Any]
    insert_timestamp: str

# Pydantic model for the flow's structured output
class SummarizeRecordOutput(BaseModel):
    summary: str = Field(..., description="A concise, human-readable summary of the record's data. If the original data is in a language other than English, translate the relevant parts and provide the summary in English.")

@genkit.flow(
    'summarizeRecordFlow',
    input_schema=SummarizeRecordInput,
    output_schema=SummarizeRecordOutput
)
def summarize_record_flow(record: SummarizeRecordInput) -> SummarizeRecordOutput:
    """
    This flow takes an ingested data record and returns a human-readable summary in English.
    """
    llm = google_ai.gemini_pro

    prompt = f"""
        As an AI assistant for a smart city platform, your task is to summarize an ingested data record into a clear, human-readable format.
        The end-user is non-technical, so avoid jargon.
        If the data contains non-English text, you MUST translate the key information and provide the final summary in English.

        Here is the data record to summarize:
        - Table Name: {record.tableName}
        - Record Data: {json.dumps(record.data, indent=2)}

        Based on this, provide a concise summary as a single block of text.
    """

    response = genkit.generate(
        model=llm,
        prompt=prompt,
        output_schema=SummarizeRecordOutput,
        config={"temperature": 0.3}
    )

    structured_output = response.output
    if not structured_output:
        raise Exception("Failed to generate a valid summary from the model.")

    return structured_output
