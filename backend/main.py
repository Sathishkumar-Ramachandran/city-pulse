import os
import genkit
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from dotenv import load_dotenv

# Import flows
from flows.domain_flow import define_data_domain_flow
from flows.ingestion_flow import extract_api_metadata_flow
from flows.transformation_flow import generate_transformation_script_flow
from flows.consumption_flow import summarize_record_flow
from services.firebase_service import store_endpoint_config, get_endpoint_config, insert_data

# Load environment variables from .env file
load_dotenv()

# Initialize Genkit with Google AI plugin
# Make sure to set GOOGLE_API_KEY in your .env file
genkit.init(
    log_level="INFO",
    plugins=[
        genkit.google_ai.google_ai(api_key=os.environ.get("GOOGLE_API_KEY")),
    ],
)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Helper to build responses from flow outputs
def build_response(result):
    if hasattr(result, 'dict'):
        return jsonify(result.dict())
    return jsonify(result)

# Helper for error responses
def build_error_response(message, status_code):
    return jsonify({"status": "error", "message": message}), status_code

# API Endpoint to define a data domain
@app.route('/define-data-domain', methods=['POST'])
def define_data_domain_route():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        if not prompt:
            return build_error_response("Request body must include 'prompt'.", 400)
        result = genkit.run(define_data_domain_flow, prompt)
        return build_response(result)
    except Exception as e:
        print(f"Error in /define-data-domain: {e}")
        return build_error_response(f"An unexpected error occurred: {e}", 500)

# API Endpoint to extract metadata from a data source description
@app.route('/extract-api-metadata', methods=['POST'])
def extract_api_metadata_route():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        if not prompt:
            return build_error_response("Request body must include a 'prompt'.", 400)
        result = genkit.run(extract_api_metadata_flow, prompt)
        return build_response(result)
    except Exception as e:
        print(f"Error in /extract-api-metadata: {e}")
        return build_error_response(f"An unexpected error occurred: {e}", 500)

# API Endpoint to generate a Python transformation script
@app.route('/generate-transformation-script', methods=['POST'])
def generate_transformation_script_route():
    try:
        data = request.get_json()
        transformation_prompt = data.get('transformationPrompt')
        if not transformation_prompt:
            return build_error_response("Request body must include 'transformationPrompt'.", 400)
        result = genkit.run(generate_transformation_script_flow, transformation_prompt)
        return build_response(result)
    except Exception as e:
        print(f"Error in /generate-transformation-script: {e}")
        return build_error_response(f"An unexpected error occurred: {e}", 500)

# API Endpoint to store the final endpoint configuration
@app.route('/store-endpoint-config', methods=['POST'])
def store_endpoint_config_route():
    try:
        config_data = request.get_json()
        if not config_data:
            return build_error_response("Request body must be a valid JSON.", 400)
        response = store_endpoint_config(config_data)
        if response.success:
            return jsonify({"status": "success", "message": response.message})
        else:
            return build_error_response(response.message, 500)
    except Exception as e:
        print(f"Error in /store-endpoint-config: {e}")
        return build_error_response(f"An unexpected error occurred: {e}", 500)

# API Endpoint to summarize an ingested data record
@app.route('/summarize-record', methods=['POST'])
def summarize_record_route():
    try:
        record_data = request.get_json()
        if not record_data:
            return build_error_response("Request body must be a valid JSON record.", 400)
        result = genkit.run(summarize_record_flow, record_data)
        return build_response(result)
    except Exception as e:
        print(f"Error in /summarize-record: {e}")
        return build_error_response(f"An unexpected error occurred: {e}", 500)

# Dynamic data ingestion endpoint
@app.route('/ingest/<domain>/<endpoint_id>', methods=['POST'])
def ingest_data_route(domain: str, endpoint_id: str):
    try:
        # 1. Get the configuration for this endpoint
        config_response = get_endpoint_config(domain, endpoint_id)
        if not config_response.success or not config_response.config:
            return build_error_response(f"Endpoint '{domain}/{endpoint_id}' not found or configured.", 404)
        
        config = config_response.config
        data_list = request.get_json()
        
        # Ensure data is a list
        if not isinstance(data_list, list):
            data_list = [data_list]

        # 2. (Optional) Apply transformation
        # Placeholder for transformation logic execution
        # if config.get('pythonScript'):
        #     # In a real scenario, you'd execute this script securely
        #     # For now, we'll just log that it would be applied
        #     print(f"Transformation script would be applied for {domain}/{endpoint_id}")
        
        # 3. Insert data into the correct table
        table_name = config.get('tableName')
        if not table_name:
            return build_error_response("Table name not configured for this endpoint.", 500)
            
        insertion_response = insert_data(table_name, data_list)
        if not insertion_response.success:
            return build_error_response(f"Failed to insert data: {insertion_response.message}", 500)

        return jsonify({
            "status": "success", 
            "message": f"Successfully ingested {insertion_response.rows_added} records into '{table_name}'."
        })

    except Exception as e:
        print(f"Error in /ingest/{domain}/{endpoint_id}: {e}")
        return build_error_response(f"An error occurred during ingestion: {e}", 500)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
