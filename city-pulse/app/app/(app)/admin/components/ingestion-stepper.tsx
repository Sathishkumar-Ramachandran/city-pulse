'use client';

import { useState } from 'react';
import { extractApiMetadata } from '@/ai/flows/extract-api-metadata';
import { transformData } from '@/ai/flows/transform-data-with-llm';
import { generateDataUsagePrompt } from '@/ai/flows/generate-data-usage-prompt';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, Wand2 } from 'lucide-react';

type StepperProps = {
  ingestionType: 'RestAPI' | 'Webhooks' | 'Streaming' | 'FileUpload';
};

type FormData = {
  description: string;
  metadata: any;
  transformationPrompt: string;
  transformationScript: string;
  dataUsageInstructions: string;
  dataUsagePrompt: string;
  domain: string;
};

export default function IngestionStepper({ ingestionType }: StepperProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description) return;
    setLoading(true);
    try {
      const metadata = await extractApiMetadata({ description: formData.description });
      setFormData((prev) => ({ ...prev, metadata }));
      setStep(2);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to extract metadata from prompt.' });
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = () => {
    if (formData.metadata?.is_transformation_required) {
      setStep(3);
    } else {
      setStep(4);
    }
  };

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.transformationPrompt) return;
    setLoading(true);
    try {
      const result = await transformData({
        ingestedDataSchema: formData.metadata?.schema,
        transformationPrompt: formData.transformationPrompt,
      });
      setFormData((prev) => ({ ...prev, transformationScript: result.pythonScript }));
      setStep(4);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate transformation script.' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateUsagePrompt = async () => {
    setLoading(true);
    try {
      const result = await generateDataUsagePrompt({
        domain: formData.domain || '',
        endpointId: formData.metadata.endpoint_id,
        schema: formData.metadata.schema,
        source: formData.metadata.source,
        isTransformationRequired: formData.metadata.is_transformation_required,
        isAttachment: formData.metadata.is_attachment,
        attachmentType: formData.metadata.attachment_type,
        ingestionType: formData.metadata.ingestion_type,
        tableName: formData.metadata.table_name,
        dataUsageInstructions: formData.dataUsageInstructions || '',
        dataUsers: formData.metadata.Data_Users.join(', '),
      });
      setFormData(prev => ({...prev, dataUsagePrompt: result.dataUsagePrompt}));
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate data usage prompt.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    // In a real app, this would make a POST request to the backend.
    // e.g., await fetch('/api/ingest', { method: 'POST', body: JSON.stringify(finalPayload) });
    console.log("Final payload for backend:", { ...formData.metadata, ingestionType, ...formData });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: 'Success!',
      description: `Ingestion source for ${formData.metadata?.endpoint_id} has been configured.`,
    });
    setLoading(false);
    setStep(6); // Success step
  };


  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleStep1} className="space-y-4">
            <CardTitle>Step 1: Describe Your Data Source</CardTitle>
            <CardDescription>In simple English, describe the data source. Include details like source, schema, and purpose.</CardDescription>
            <Textarea
              placeholder="e.g., This is a REST API from the Bengaluru Traffic Police that provides real-time incident data. The schema includes incident_id, timestamp, location (lat, long), type (accident, congestion), and severity."
              className="min-h-[150px]"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Extract Metadata
            </Button>
          </form>
        );
      case 2:
        return (
          <div className="space-y-4">
            <CardTitle>Step 2: Confirm Metadata</CardTitle>
            <CardDescription>The AI agent extracted the following metadata. Please review and confirm.</CardDescription>
            <pre className="mt-2 w-full whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                {JSON.stringify(formData.metadata, null, 2)}
            </pre>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={handleStep2}>Confirm & Continue</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <form onSubmit={handleStep3} className="space-y-4">
            <CardTitle>Step 3: Describe Transformation</CardTitle>
            <CardDescription>Describe how the data should be transformed. The AI will generate a Python script.</CardDescription>
            <Textarea
              placeholder="e.g., 'Translate the 'details' field from Kannada to English. Then, create a new 'full_address' column by combining 'street' and 'area'."
              className="min-h-[150px]"
              value={formData.transformationPrompt || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, transformationPrompt: e.target.value }))}
              required
            />
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Script
              </Button>
            </div>
          </form>
        );
      case 4:
        return (
            <div className="space-y-6">
                <CardTitle>Step 4: Data Usage Instructions</CardTitle>
                <CardDescription>Provide instructions and generate a prompt for other AI agents to understand and use this data.</CardDescription>
                
                <div className="space-y-2">
                    <Label htmlFor="domain">Data Domain</Label>
                    <Input id="domain" placeholder="e.g., Traffic, Utilities, Health" value={formData.domain || ''} onChange={(e) => setFormData(prev => ({...prev, domain: e.target.value}))} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="usageInstructions">Data Usage Instructions</Label>
                    <Textarea id="usageInstructions" placeholder="e.g., This data should be used for real-time incident mapping and alerting public safety officials. Do not use for historical analysis." className="min-h-[100px]" value={formData.dataUsageInstructions || ''} onChange={(e) => setFormData(prev => ({...prev, dataUsageInstructions: e.target.value}))} />
                </div>
                
                {formData.dataUsagePrompt && (
                   <Alert>
                      <Wand2 className="h-4 w-4" />
                      <AlertTitle>Generated Data Usage Prompt</AlertTitle>
                      <AlertDescription>
                        {formData.dataUsagePrompt}
                      </AlertDescription>
                    </Alert>
                )}
                
                <div className="flex gap-4 items-center">
                    <Button variant="outline" onClick={() => setStep(formData.metadata?.is_transformation_required ? 3 : 2)}>Back</Button>
                    <Button onClick={handleGenerateUsagePrompt} variant="outline" type="button" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Usage Prompt
                    </Button>
                    <Button onClick={() => setStep(5)} disabled={!formData.dataUsagePrompt}>Continue to Summary</Button>
                </div>
            </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <CardTitle>Step 5: Summary</CardTitle>
            <CardDescription>Review the complete configuration before submitting.</CardDescription>
            <Alert>
              <AlertTitle>{formData.metadata?.endpoint_id}</AlertTitle>
              <AlertDescription>
                  <pre className="mt-2 w-full whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                      {JSON.stringify({ ...formData.metadata, ingestionType, ...formData }, null, 2)}
                  </pre>
              </AlertDescription>
            </Alert>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(4)}>Back</Button>
              <Button onClick={handleFinalSubmit} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Configuration
              </Button>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold">Configuration Complete!</h2>
            <p className="mt-2 text-muted-foreground">
              The data source for <strong>{formData.metadata?.endpoint_id}</strong> has been successfully configured.
            </p>
            <Button className="mt-6" onClick={() => { setStep(1); setFormData({}); }}>
              Configure Another Source
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="p-4 border rounded-lg min-h-[400px]">{renderStep()}</div>;
}
