import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { Link } from 'react-router-dom';

interface Trip {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
}

export function HomePage() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    apiClient.get('/trips').then(res => setTrips(res.data)).catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Explore Trips</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map(trip => (
          <div key={trip.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
            {trip.image_url ? (
               <img src={trip.image_url} alt={trip.name} className="h-48 w-full object-cover" />
            ) : (
               <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
            )}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{trip.name}</h3>
              <p className="text-gray-500 mb-4 line-clamp-3 flex-1">{trip.description}</p>
              <div className="mt-auto">
                  <p className="text-lg font-bold text-gray-900 mb-3">${trip.price}</p>
                  <Link to={`/trips/${trip.id}`} className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium">
                    View Details
                  </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
