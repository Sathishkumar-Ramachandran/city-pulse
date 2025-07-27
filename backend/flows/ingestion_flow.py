import genkit
from genkit.google_ai import google_ai
from pydantic import BaseModel, Field
from typing import List, Optional

# This Pydantic model defines the structured output the AI should generate.
# It aligns with the frontend's 'ExtractApiMetadataOutput' type.
class ApiMetadataModel(BaseModel):
    domain: str = Field(..., description="The domain of the API (e.g., 'CityServices', 'PublicHealth', 'Transportation'). Use PascalCase.")
    endpointId: str = Field(..., description="A unique identifier for the API endpoint (e.g., 'traffic_incidents_v1', 'air_quality_feed'). Use snake_case.")
    schema_str: str = Field(..., alias='schema', description="A string representation of the JSON schema of the data returned by the API. This must be a valid JSON string.")
    source: str = Field(..., description="The source of the data (e.g., 'Metropolis Transport Authority API', 'Citizen Reporting Portal').")
    isTransformationRequired: bool = Field(..., description="Whether data transformation is required to match the target schema or for cleaning purposes. Infer this from the user's description.")
    isAttachment: bool = Field(..., description="Whether the data typically includes a file attachment. Defaults to false if not mentioned.")
    attachmentType: Optional[str] = Field(None, description="The type of attachment, if any (e.g., 'PDF', 'CSV', 'Image'). Can be null.")
    ingestionType: str = Field(..., description="Must be one of 'RestAPI', 'Streaming', 'Webhooks', 'FileUpload', based on the user's description.")
    tableName: str = Field(..., description="A database-friendly name for the table to store the ingested data (e.g., 'traffic_incidents', 'air_quality_sensors'). Use snake_case.")
    dataUsageInstructions: str = Field(..., description="Generate clear, specific instructions for how this data should be used by other agents or for analysis.")
    dataUsagePrompt: str = Field(..., description="Generate a concise prompt that an AI could use to understand the context and purpose of this data.")
    dataUsers: List[str] = Field(..., description="A list of potential user roles who would access this data, e.g., 'Administrators', 'Data Analysts', 'Emergency Responders'.")

@genkit.flow(
    'extractApiMetadataFlow',
    input_schema=str,
    output_schema=ApiMetadataModel
)
def extract_api_metadata_flow(prompt: str) -> ApiMetadataModel:
    """
    This flow takes a natural language prompt about a data source
    and returns structured metadata extracted by the AI.
    """
    extraction_prompt = f"""
        You are an expert data architect for a smart city platform. Your task is to extract API and data source metadata from a user-provided description. Analyze the description and format the output as a structured JSON object.

        User's Description: "{prompt}"

        Adhere strictly to the requested JSON schema. The 'schema' field must be a stringified JSON representing the data structure.
    """
    
    llm = google_ai.gemini_pro
    response = genkit.generate(
        model=llm,
        prompt=extraction_prompt,
        output_schema=ApiMetadataModel,
        config={"temperature": 0.1}
    )
    
    structured_output = response.output
    if not structured_output:
        raise Exception("Failed to generate valid API metadata from the model.")
        
    return structured_output
