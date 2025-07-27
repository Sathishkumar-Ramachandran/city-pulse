'use server';

/**
 * @fileOverview A Genkit flow for converting a street address to geographic coordinates.
 *
 * - geocodeAddress - A function that takes an address and returns its latitude and longitude.
 */

import { ai } from '@/ai/genkit';
import { GeocodeAddressInput, GeocodeAddressInputSchema, GeocodeAddressOutput, GeocodeAddressOutputSchema } from '@/ai/schemas/geocode-address-schema';


export async function geocodeAddress(input: GeocodeAddressInput): Promise<GeocodeAddressOutput> {
    return geocodeAddressFlow(input);
}

const geocodeAddressFlow = ai.defineFlow(
  {
    name: 'geocodeAddressFlow',
    inputSchema: GeocodeAddressInputSchema,
    outputSchema: GeocodeAddressOutputSchema,
  },
  async ({ address }) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('Google Maps API key is not configured.');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      throw new Error(`Geocoding failed for address "${address}": ${data.status} - ${data.error_message || 'No results found.'}`);
    }

    const location = data.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng,
    };
  }
);
