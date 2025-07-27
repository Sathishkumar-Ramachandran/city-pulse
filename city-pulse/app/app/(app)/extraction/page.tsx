'use client';

import { useState } from 'react';
import { automateDataExtraction } from '@/ai/flows/automate-data-extraction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function ExtractionPage() {
  const [instructions, setInstructions] = useState('');
  const [result, setResult] = useState<any>(null);
  const [running, setRunning] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setRunning(true);
    try {
      const output = await automateDataExtraction({ extractionInstructions: instructions });
      setResult(output);
    } catch (error) {
      console.error(error);
      // Optionally, show a toast notification for the error
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Extraction Automation</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configure New Extraction</CardTitle>
            <CardDescription>
              Use natural language to describe the data extraction task you want to automate. The AI agent will generate the configuration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="instructions">Extraction Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="e.g., 'Scrape the top 5 news headlines from bbc.com/news every hour' or 'Poll the weather API at api.weather.com/v1/bengaluru every 30 minutes for temperature and humidity.'"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="min-h-[150px]"
                  required
                />
              </div>
              <Button type="submit" disabled={running}>
                {running && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Automate Extraction
              </Button>
            </form>
          </CardContent>
        </Card>

        {running && (
          <Card className="flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">AI agent is working...</p>
            </div>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Extraction Plan</CardTitle>
              <CardDescription>
                The AI agent has generated the following plan. This would be sent to the backend for execution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTitle>Status: {result.status}</AlertTitle>
                <AlertDescription>
                  <pre className="mt-2 w-full whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                    {JSON.stringify(result.extractionDetails, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
