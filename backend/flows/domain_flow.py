import genkit
from genkit.google_ai import google_ai
from pydantic import BaseModel, Field
from typing import List, Dict, Any

# Pydantic model for the structured output of the flow
class DataDomainModel(BaseModel):
    domain_name: str = Field(..., description="A concise, descriptive name for the data domain (e.g., 'PublicTransport', 'AirQuality'). Use PascalCase.")
    criticality_level: int = Field(..., ge=1, le=5, description="A number from 1 (low) to 5 (high) representing the data's importance for city operations.")
    labels: List[str] = Field(..., description="A list of relevant keywords or tags for easy searching.")
    authorized_users: List[str] = Field(..., description="A list of user roles authorized to access this data (e.g., 'Admin', 'Traffic_Analyst', 'Public_Health_Official').")
    schema_definition: Dict[str, Any] = Field(..., description="A proposed database schema as a JSON object, with field names as keys and data types as values (e.g., 'STRING', 'INTEGER', 'TIMESTAMP', 'FLOAT', 'BOOLEAN', 'GEOGRAPHY').")
    table_name: str = Field(..., description="A suitable, database-friendly name for the table that will store this data. Use snake_case.")

@genkit.flow(
    'defineDataDomainFlow',
    input_schema=str,
    output_schema=DataDomainModel
)
def define_data_domain_flow(prompt: str) -> DataDomainModel:
    """
    This flow takes a natural language prompt about a data domain and returns a structured
    definition for it using an AI model.
    """
    llm = google_ai.gemini_pro

    define_data_domain_prompt = f"""
        You are an expert data architect for a smart city platform. Your task is to analyze a user's description of a data source and generate a structured JSON object that defines its properties.

        Based on the user's prompt, you must determine the following attributes.

        User's Prompt: "{prompt}"

        Provide your response in a structured JSON format.
    """

    response = genkit.generate(
        model=llm,
        prompt=define_data_domain_prompt,
        output_schema=DataDomainModel,
        config={"temperature": 0.2}
    )
    
    structured_output = response.output
    if not structured_output:
        raise Exception("Failed to generate a valid data domain definition from the model.")

    return structured_output
