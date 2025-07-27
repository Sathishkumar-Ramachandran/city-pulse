import genkit
from pydantic import BaseModel

class ExtractionInput(BaseModel):
    source_type: str
    config: dict

class ExtractionOutput(BaseModel):
    status: str
    data_preview: str

# Placeholder for extraction flow
extraction_flow = genkit.flow(
    'extractionFlow',
    input_schema=ExtractionInput,
    output_schema=ExtractionOutput
)(
    lambda data: {"status": "success", "data_preview": f"Data extracted from {data.source_type}"}
)
