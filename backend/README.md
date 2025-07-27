# CityNexus Backend Documentation

This document provides a comprehensive guide for the backend team to develop the necessary APIs for the CityNexus frontend. It outlines the frontend design, components involved in data ingestion, their responsibilities, and the expected API contracts.

## 1. Overview of the Ingestion & Extraction Flow

The frontend is designed to guide users through a multi-step process for setting up new data sources. This process involves two main stages: **Extraction** and **Ingestion**.

1.  **Extraction Setup**: This is the first step where the user defines how data is to be extracted from a source. This can be through various methods like REST APIs (on a schedule), web scraping, streaming platforms, etc. The backend is expected to manage these extraction tasks. (This feature is currently a placeholder on the frontend).
2.  **Ingestion Setup**: Once data is extracted, it needs to be ingested into the system. The frontend provides a UI to define the metadata and schema for this incoming data. This is the primary focus of the API endpoints detailed below.

## 2. Frontend Components for Ingestion

The core of the ingestion setup is within the `/src/components/ingest/` directory.

-   **`ingestion-tabs.tsx`**: This component renders the main tabs for different ingestion methods (REST API, Webhooks, Streaming, File Upload). It acts as a container for the `IngestionForm`.
-   **`ingestion-form.tsx`**: This is the main stateful component that manages the multi-step workflow for a given ingestion method. It makes calls to the backend APIs.

### Ingestion Workflow Steps:

The `IngestionForm` guides the user through the following steps:

1.  **Describe Data Source (Initial)**: The user provides a natural language description of the data source. For file uploads, they upload a file; for webhooks, they are given an endpoint.
2.  **Confirm Schema (Metadata)**: The frontend sends the description to the backend, which uses an AI flow to extract structured metadata. The frontend displays this metadata for user confirmation.
3.  **Data Usage (Usage)**: The user reviews and can edit AI-generated instructions for how the data should be used, including usage prompts and authorized users.
4.  **Describe Transformation (Transform)**: If the AI determines that a data transformation is needed, the user is prompted to describe the transformation logic in natural language.
5.  **Review Script (Script)**: The backend takes the transformation logic and generates a Python script (using Pandas/NumPy). The frontend displays this script for the user's final review.
6.  **Complete**: The setup is finished. The frontend displays a success message.

## 3. Backend API Endpoints

The frontend expects a Flask backend running at the `NEXT_PUBLIC_BACKEND_URL` environment variable. All communication is done via JSON over HTTP.

### Endpoint 1: Extract API Metadata

-   **URL**: `/extract-api-metadata`
-   **Method**: `POST`
-   **Description**: Takes a user's natural language prompt about a data source and returns structured metadata extracted by a Genkit AI flow.
-   **Frontend Action File**: `src/app/actions/ingestion.ts` (`runExtractApiMetadata` function)

#### Request Body (from Frontend)

```json
{
  "prompt": "A string containing the user's description of the data source."
}
```

#### Success Response (to Frontend)

The backend should return a JSON object with the following structure. Note that `schema` in the frontend corresponds to `schema_str` in the backend's Pydantic model to avoid conflicts.

```json
{
  "domain": "string",
  "endpointId": "string",
  "schema": "string", // This is the proposed database schema as a string
  "source": "string",
  "isTransformationRequired": "boolean",
  "isAttachment": "boolean",
  "attachmentType": "string | null",
  "ingestionType": "'RestAPI' | 'Streaming' | 'Webhooks' | 'FileUpload'",
  "tableName": "string",
  "dataUsageInstructions": "string",
  "dataUsagePrompt": "string",
  "dataUsers": ["string"]
}
```

### Endpoint 2: Generate Transformation Script

-   **URL**: `/generate-transformation-script`
-   **Method**: `POST`
-   **Description**: Takes a user's natural language prompt describing data transformation logic and returns a Python script.
-   **Frontend Action File**: `src/app/actions/ingestion.ts` (`runGenerateTransformationScript` function)

#### Request Body (from Frontend)

```json
{
  "transformationPrompt": "A string containing the user's description of the required transformation."
}
```

#### Success Response (to Frontend)

```json
{
  "pythonScript": "string" // A string containing the generated Python code
}
```

## 4. Final Backend Operations (Implied)

After the user confirms the schema and transformation script (if any), the frontend flow finishes. The backend is implicitly expected to handle the final setup, which includes:

1.  **Creating the Database Table**: Using the confirmed `tableName` and `schema`, create a table in the database (e.g., BigQuery).
2.  **Deploying the Transformation Script**: If a script was generated, it should be deployed as a serverless function (e.g., Cloud Function) that will be triggered when new data arrives at this endpoint.
3.  **Activating the Endpoint**: The ingestion endpoint (`endpointId`) should be made live and ready to accept data according to the specified `ingestionType`.

These final operations are not triggered by a direct API call from the current frontend workflow but are the logical next steps for the backend to perform upon successful completion of the setup flow. The backend team should consider how to trigger and manage these tasks.
