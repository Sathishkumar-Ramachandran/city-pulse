import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IngestionStepper from "./ingestion-stepper";

export default function DataSourceSetup() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Source Endpoint Setup</CardTitle>
        <CardDescription>
          Configure new data sources to be ingested into the CityPulse platform. Select the ingestion method to begin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="restApi">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="restApi">REST API</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="streaming">Streaming</TabsTrigger>
            <TabsTrigger value="fileUploads">File Uploads</TabsTrigger>
          </TabsList>
          <TabsContent value="restApi" className="mt-4">
            <IngestionStepper ingestionType="RestAPI" />
          </TabsContent>
          <TabsContent value="webhooks" className="mt-4">
            <IngestionStepper ingestionType="Webhooks" />
          </TabsContent>
          <TabsContent value="streaming" className="mt-4">
            <IngestionStepper ingestionType="Streaming" />
          </TabsContent>
          <TabsContent value="fileUploads" className="mt-4">
             <IngestionStepper ingestionType="FileUpload" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
