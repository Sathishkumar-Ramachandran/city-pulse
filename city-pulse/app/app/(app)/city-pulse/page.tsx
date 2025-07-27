
'use client';
import { Card, CardContent } from "@/components/ui/card";
import { geocodeAddress } from "@/ai/flows/geocode-address";
import { useEffect, useState } from "react";
import { issues } from "../issues/page";
import { ingestedData } from "../ingested-data/page";
import { newsItems } from "../news-feed/page";
import { Loader2 } from "lucide-react";
import { APIProvider, Map as GoogleMap, Marker, InfoWindow } from '@vis.gl/react-google-maps';

type MarkerType = 'issue' | 'ingestion' | 'news';

type MapMarker = {
    id: string;
    position: { lat: number; lng: number };
    title: string;
    details: string;
    type: MarkerType;
};

type DataItem = {
    id: string;
    title: string;
    address: string;
    details: string;
    type: MarkerType;
}

const BENGALURU_POSITION = { lat: 12.9716, lng: 77.5946 };

function Map({ apiKey, markers = [] }: { apiKey: string, markers: MapMarker[] }) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  if (!apiKey) {
    return (
        <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center">
                Could not load map.<br/>
                Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.
            </p>
        </div>
    )
  }
  
  return (
    <APIProvider apiKey={apiKey}>
      <GoogleMap
        style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
        defaultCenter={BENGALURU_POSITION}
        defaultZoom={10}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId="citywise_map"
        onClick={() => setSelectedMarker(null)}
      >
        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={marker.position}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}

        {selectedMarker && (
            <InfoWindow
                position={selectedMarker.position}
                onCloseClick={() => setSelectedMarker(null)}
            >
                <div>
                    <h3 className="font-bold text-base">{selectedMarker.title}</h3>
                    <p className="text-sm">{selectedMarker.details}</p>
                </div>
            </InfoWindow>
        )}

      </GoogleMap>
    </APIProvider>
  );
}


export default function CityPulsePage() {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    const [markers, setMarkers] = useState<MapMarker[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoordinates = async () => {
            setLoading(true);
            const combinedData: DataItem[] = [
                ...issues.map(item => ({ id: `issue-${item.id}`, title: item.title, address: item.address || 'Bengaluru', details: `Domain: ${item.domain}, Priority: ${item.priority}`, type: 'issue' as MarkerType })),
                ...ingestedData.map(item => ({ id: `ingest-${item.id}`, title: `Ingestion: ${item.endpoint_id}`, address: item.address || 'Bengaluru', details: `Source: ${item.source}, Records: ${item.records}`, type: 'ingestion' as MarkerType })),
                ...newsItems.map(item => ({ id: `news-${item.title}`, title: item.title, address: item.address || 'Bengaluru', details: item.category, type: 'news' as MarkerType }))
            ];

            const geocodedMarkers: MapMarker[] = await Promise.all(
                combinedData.map(async (item) => {
                    try {
                        if (item.address && typeof item.address === 'string' && item.address.trim() !== '') {
                            const coords = await geocodeAddress({ address: item.address });
                            return {
                                id: item.id,
                                position: { lat: coords.lat, lng: coords.lng },
                                title: item.title,
                                details: item.details,
                                type: item.type
                            };
                        }
                    } catch (error) {
                        console.error(`Failed to geocode address: ${item.address}`, error);
                    }
                    // Fallback for failed geocoding or missing address
                    const latJitter = (Math.random() - 0.5) * 0.2;
                    const lngJitter = (Math.random() - 0.5) * 0.2;
                    return {
                        id: item.id,
                        position: { lat: BENGALURU_POSITION.lat + latJitter, lng: BENGALURU_POSITION.lng + lngJitter },
                        title: item.title,
                        details: `${item.details} (Location estimated)`,
                        type: item.type
                    };
                })
            ).then(results => results.filter((r): r is MapMarker => r !== null));
            
            setMarkers(geocodedMarkers);
            setLoading(false);
        };
        
        if (apiKey) {
          fetchCoordinates();
        } else {
          setLoading(false);
        }
    }, [apiKey]);

    return (
        <div className="flex-1 flex flex-col h-full w-full">
            <Card className="flex-1 w-full h-full rounded-none border-none">
                <CardContent className="p-0 h-full">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                           <Loader2 className="mr-2 h-8 w-50 animate-spin" />
                           <p>Loading map data and geocoding addresses...</p>
                        </div>
                    ) : (
                        <Map apiKey={apiKey} markers={markers} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
