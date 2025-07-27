import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, User } from "lucide-react";

export default function MonitoringAssistantPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 flex flex-col h-full">
      <h1 className="text-3xl font-bold tracking-tight">Monitoring Assistant</h1>
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Chat with CityPulse AI</CardTitle>
          <CardDescription>Ask questions about city data, recent events, or system status.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-4 overflow-y-auto p-6">
          <div className="flex items-start gap-4">
            <Bot className="h-8 w-8 text-primary flex-shrink-0"/>
            <div className="bg-muted p-3 rounded-lg">
              <p className="font-bold">CityPulse AI</p>
              <p>Hello! How can I help you monitor the city today?</p>
            </div>
          </div>
          <div className="flex items-start gap-4 justify-end">
             <div className="bg-primary text-primary-foreground p-3 rounded-lg">
              <p className="font-bold">You</p>
              <p>Show me all critical traffic incidents in the last 3 hours.</p>
            </div>
            <User className="h-8 w-8 flex-shrink-0" />
          </div>
           <div className="flex items-start gap-4">
            <Bot className="h-8 w-8 text-primary flex-shrink-0"/>
            <div className="bg-muted p-3 rounded-lg">
              <p className="font-bold">CityPulse AI</p>
              <p>I have found 2 critical traffic incidents: one at Silk Board junction and another on the Outer Ring Road near Marathahalli. Would you like details?</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="flex w-full items-center space-x-2">
            <Input id="message" placeholder="Type your message..." className="flex-1" autoComplete="off" />
            <Button type="submit">Send</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
