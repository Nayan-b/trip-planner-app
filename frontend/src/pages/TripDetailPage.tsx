import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../api/client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Destination {
  id: number;
  name: string;
  description: string;
  lat: number;
  lon: number;
}

interface ItineraryItem {
  id: number;
  day_number: number;
  title: string;
  description: string;
}

interface TripDetail {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url?: string;
  destinations: Destination[];
  itinerary_items: ItineraryItem[];
}

export function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<TripDetail | null>(null);


  
  // Fix the typo in useEffect
  useEffect(() => {
      apiClient.get(`/trips/${id}`).then(res => setTrip(res.data)).catch(console.error);
  }, [id]);

  if (!trip) return <div className="p-8 text-center">Loading...</div>;

  const centerLat = trip.destinations.length > 0 ? trip.destinations[0].lat : 20.0;
  const centerLon = trip.destinations.length > 0 ? trip.destinations[0].lon : 0.0;
  const zoom = trip.destinations.length > 0 ? 6 : 2;

  const handleBook = async () => {
      try {
          await apiClient.post('/bookings/', { trip_id: trip.id });
          alert('Booking successful!');
      } catch (e) {
          alert('Booking failed. Please login.');
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {trip.image_url && <img src={trip.image_url} alt={trip.name} className="h-64 w-full object-cover" />}
        <div className="p-6">
          <div className="flex justify-between items-start">
             <div>
               <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.name}</h1>
               <p className="text-gray-600 mb-4">{trip.description}</p>
             </div>
             <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 mb-2">${trip.price}</p>
                <button onClick={handleBook} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium">Book Now</button>
             </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
               <h2 className="text-xl font-semibold mb-4">Itinerary</h2>
               <div className="space-y-4">
                 {trip.itinerary_items.sort((a,b) => a.day_number - b.day_number).map(item => (
                   <div key={item.id} className="border-l-4 border-blue-500 pl-4 py-2">
                     <p className="text-sm font-bold text-blue-600">Day {item.day_number}</p>
                     <h4 className="text-lg font-medium">{item.title}</h4>
                     <p className="text-gray-500">{item.description}</p>
                   </div>
                 ))}
                 {trip.itinerary_items.length === 0 && <p className="text-gray-500">No itinerary available.</p>}
               </div>
             </div>
             <div>
               <h2 className="text-xl font-semibold mb-4">Destinations Map</h2>
               <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-200">
                 <MapContainer center={[centerLat, centerLon]} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {trip.destinations.map(dest => (
                        dest.lat !== 0 && (
                            <Marker key={dest.id} position={[dest.lat, dest.lon]}>
                                <Popup>
                                    <strong>{dest.name}</strong><br/>{dest.description}
                                </Popup>
                            </Marker>
                        )
                    ))}
                 </MapContainer>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
