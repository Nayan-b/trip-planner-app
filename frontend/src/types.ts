export interface Trip {
  id: number;
  name: string;
  description?: string;
  price?: number;
  image_url?: string;
  rating?: number;
  destinations?: Destination[];
  itinerary_items?: ItineraryItem[];
}

export interface Destination {
  id: number;
  trip_id: number;
  name: string;
  description?: string;
  lat: number;
  lon: number;
}

export interface ItineraryItem {
  id: number;
  trip_id: number;
  day_number: number;
  title: string;
  description?: string;
}
