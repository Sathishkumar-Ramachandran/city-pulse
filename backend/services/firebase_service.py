import firebase_admin
from firebase_admin import credentials, firestore
import os
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import uuid

# Initialize Firebase Admin SDK
try:
    if not firebase_admin._apps:
        cred = credentials.ApplicationDefault()
        project_id = os.environ.get('GCP_PROJECT_ID', 'citypulse-671aa')
        
        firebase_admin.initialize_app(cred, {
            'projectId': project_id,
        })
except Exception as e:
    print(f"Warning: Failed to initialize Firebase Admin SDK: {e}. Firestore operations will fail.")
    pass

db = firestore.client()

# Pydantic models for service responses
class EndpointConfigResponse(BaseModel):
    success: bool
    message: str
    config: Optional[Dict[str, Any]] = None

class DataInsertionResponse(BaseModel):
    success: bool
    message: str
    rows_added: int = 0
    document_ids: List[str] = []

def store_endpoint_config(config_data: Dict[str, Any]) -> EndpointConfigResponse:
    """
    Stores the configuration for a dynamic endpoint in a dedicated '__endpoint_configs__' collection.
    The document ID is a composite of domain and endpointId for easy lookup.
    """
    try:
        domain = config_data.get("domain")
        endpoint_id = config_data.get("endpointId")
        if not domain or not endpoint_id:
            raise ValueError("Config data must include 'domain' and 'endpointId'.")
        
        doc_id = f"{domain}:{endpoint_id}"
        endpoint_ref = db.collection('__endpoint_configs__').document(doc_id)
        
        config_data_with_timestamp = {**config_data, "created_at": firestore.SERVER_TIMESTAMP}
        endpoint_ref.set(config_data_with_timestamp)

        return EndpointConfigResponse(
            success=True,
            message=f"Configuration for endpoint '{doc_id}' stored successfully.",
            config=config_data
        )
    except Exception as e:
        return EndpointConfigResponse(success=False, message=str(e))

def get_endpoint_config(domain: str, endpoint_id: str) -> EndpointConfigResponse:
    """
    Retrieves the configuration for a dynamic endpoint from the '__endpoint_configs__' collection.
    """
    try:
        if not domain or not endpoint_id:
            raise ValueError("Domain and endpointId are required.")
            
        doc_id = f"{domain}:{endpoint_id}"
        endpoint_ref = db.collection('__endpoint_configs__').document(doc_id)
        
        doc = endpoint_ref.get()
        if doc.exists:
            return EndpointConfigResponse(
                success=True,
                message="Configuration retrieved successfully.",
                config=doc.to_dict()
            )
        else:
            return EndpointConfigResponse(
                success=False,
                message=f"No configuration found for endpoint '{doc_id}'."
            )
    except Exception as e:
        return EndpointConfigResponse(success=False, message=str(e))

def insert_data(table_name: str, data_list: List[Dict[str, Any]]) -> DataInsertionResponse:
    """
    Inserts a list of data dictionaries as documents into a specified Firestore collection.
    Each document gets a unique UUID and an insert timestamp.
    """
    try:
        if not table_name:
            raise ValueError("Table name cannot be empty.")
        if not data_list:
            return DataInsertionResponse(success=True, message="No data to insert.", rows_added=0)

        collection_ref = db.collection(table_name)
        batch = db.batch()
        added_ids = []

        for data_item in data_list:
            doc_id = str(uuid.uuid4())
            doc_ref = collection_ref.document(doc_id)
            
            data_with_metadata = {
                **data_item,
                "uuid": doc_id,
                "insert_timestamp": firestore.SERVER_TIMESTAMP
            }
            batch.set(doc_ref, data_with_metadata)
            added_ids.append(doc_ref.id)

        batch.commit()

        return DataInsertionResponse(
            success=True,
            message=f"Successfully added {len(data_list)} rows to '{table_name}'.",
            rows_added=len(data_list),
            document_ids=added_ids
        )
    except Exception as e:
        return DataInsertionResponse(success=False, message=str(e))
