import genkit
from genkit.google_ai import google_ai
from pydantic import BaseModel, Field

# Pydantic model for the structured output
class TransformScriptGenOutput(BaseModel):
    pythonScript: str

@genkit.flow(
    'generateTransformationScriptFlow',
    input_schema=str,
    output_schema=TransformScriptGenOutput
)
def generate_transformation_script_flow(transformation_prompt: str) -> TransformScriptGenOutput:
    """
    This flow takes a natural language prompt and generates a Python script
    for data transformation using Pandas and NumPy.
    """
    script_gen_prompt = f"""
        You are an expert data engineer specializing in writing Python transformation scripts using the Pandas library.
        Your task is to generate a Python script based on a user's request.

        The script MUST contain a function `transform(data)` that takes a single dictionary object as input and returns a transformed dictionary object.
        The script should include necessary imports, primarily `pandas`. Do not include any example usage or calls to the function itself.

        User's Transformation Request: "{transformation_prompt}"

        Generate only the Python code for the script.
    """

    llm = google_ai.gemini_pro
    response = genkit.generate(
        model=llm,
        prompt=script_gen_prompt,
        output_schema=TransformScriptGenOutput,
        config={"temperature": 0.2}
    )
    
    structured_output = response.output
    if not structured_output:
        raise Exception("Failed to generate a valid Python script from the model.")
        
    return structured_output
