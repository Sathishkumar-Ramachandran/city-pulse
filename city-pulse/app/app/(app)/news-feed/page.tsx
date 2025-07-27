import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';

export const newsItems = [
  {
    title: "New Metro Line Inaugurated",
    description: "The new Purple Line extension connecting Whitefield to the city center was inaugurated today, promising to ease traffic congestion.",
    category: "Infrastructure",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "city train",
    date: "2 hours ago",
    address: "Whitefield, Bengaluru"
  },
  {
    title: "City Prepares for Annual Tech Summit",
    description: "Bengaluru is gearing up to host the Global Tech Summit next week, with top innovators and leaders expected to attend.",
    category: "Events",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "tech conference",
    date: "1 day ago",
    address: "Palace Grounds, Bengaluru"
  },
  {
    title: "Smart Traffic Management System Deployed",
    description: "AI-powered traffic signals have been installed at major junctions to optimize traffic flow and reduce waiting times.",
    category: "Traffic",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "traffic lights",
    date: "3 days ago",
    address: "MG Road, Bengaluru"
  },
  {
    title: "Green Initiative: 10,000 Saplings Planted",
    description: "As part of the 'Green Bengaluru' campaign, volunteers and city officials planted 10,000 saplings across various parks.",
    category: "Environment",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "planting trees",
    date: "5 days ago",
    address: "Cubbon Park, Bengaluru"
  },
];

export default function NewsFeedPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">News Feed</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsItems.map((item, index) => (
          <Card key={index} className="flex flex-col overflow-hidden">
            <CardHeader className="p-0">
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
                data-ai-hint={item.imageHint}
              />
            </CardHeader>
            <CardContent className="flex-grow p-6">
              <Badge variant="secondary" className="mb-2">{item.category}</Badge>
              <CardTitle className="text-xl font-headline mb-2">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardContent>
            <CardFooter className="bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">{item.date}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
