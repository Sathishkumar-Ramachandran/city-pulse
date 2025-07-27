import genkit
from pydantic import BaseModel
from services.firebase_service import insert_data

class LoadingInput(BaseModel):
    table_name: str
    data: list

class LoadingOutput(BaseModel):
    status: str
    rows_loaded: int

@genkit.flow(
    'loadingFlow',
    input_schema=LoadingInput,
    output_schema=LoadingOutput
)
def loading_flow(load_input: LoadingInput) -> LoadingOutput:
    """
    This flow takes data and a table name and inserts the data into Firestore.
    """
    if not load_input.table_name:
        raise ValueError("Table name is required for loading data.")
    if not load_input.data:
        return LoadingOutput(status="success", rows_loaded=0)

    try:
        # Using the service to interact with Firestore
        response = insert_data(
            table_name=load_input.table_name,
            data_list=load_input.data
        )
        
        if response.success:
            return LoadingOutput(status="success", rows_loaded=response.rows_added)
        else:
            # Propagate error from the service layer
            raise Exception(f"Failed to load data: {response.message}")
            
    except Exception as e:
        # Catch any other exceptions
        raise Exception(f"An error occurred during the loading process: {str(e)}")
