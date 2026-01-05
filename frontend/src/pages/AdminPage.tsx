import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { Trip } from '../types';

export function AdminPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);

  // Destination form
  const [destName, setDestName] = useState('');
  const [destDesc, setDestDesc] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  
  // Itinerary form
  const [dayNum, setDayNum] = useState('');
  const [itinTitle, setItinTitle] = useState('');
  const [itinDesc, setItinDesc] = useState('');

  const fetchTrips = async () => {
    try {
      const res = await apiClient.get('/trips/');
      setTrips(res.data);
    } catch (e: any) {
      console.error('Error fetching trips:', e);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCreateOrUpdateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedTripId) {
        // Update
        await apiClient.put(`/trips/${selectedTripId}`, {
          name,
          description,
          price: parseFloat(price),
          image_url: imageUrl
        });
        alert('Trip updated!');
        // Refresh list
        fetchTrips();
      } else {
        // Create
        const res = await apiClient.post('/trips/', {
          name,
          description,
          price: parseFloat(price),
          image_url: imageUrl
        });
        setSelectedTripId(res.data.id);
        alert('Trip created! Now add destinations and itinerary.');
        fetchTrips();
      }
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const handleEditClick = (trip: Trip) => {
    setSelectedTripId(trip.id);
    setName(trip.name);
    setDescription(trip.description || '');
    setPrice(trip.price?.toString() || '');
    setImageUrl(trip.image_url || '');
  };

  const handleNewTripClick = () => {
    setSelectedTripId(null);
    setName('');
    setDescription('');
    setPrice('');
    setImageUrl('');
    // Clear sub-forms too if desired
    setDestName(''); setDestDesc(''); setLat(''); setLon('');
    setDayNum(''); setItinTitle(''); setItinDesc('');
  };

  const handleAddDest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripId) return;
    try {
      await apiClient.post(`/trips/${selectedTripId}/destinations`, {
        name: destName,
        description: destDesc,
        lat: parseFloat(lat),
        lon: parseFloat(lon)
      });
      alert('Destination added!');
      setDestName(''); setDestDesc(''); setLat(''); setLon('');
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };
  
  const handleAddItin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedTripId) return;
      try {
        await apiClient.post(`/trips/${selectedTripId}/itinerary`, {
          day_number: parseInt(dayNum),
          title: itinTitle,
          description: itinDesc
        });
        alert('Itinerary item added!');
        setDayNum(''); setItinTitle(''); setItinDesc('');
      } catch (e: any) {
        alert('Error: ' + e.message);
      }
    };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-3">
        <h1 className="text-3xl font-bold mb-4">Trip Management</h1>
      </div>
      {/* Sidebar List of Trips */}
      <div className="md:col-span-1 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Existing Trips</h2>
        <button onClick={handleNewTripClick} className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded mb-4 hover:bg-gray-300">
          + Create New Trip
        </button>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {trips.map(trip => (
            <div 
              key={trip.id} 
              onClick={() => handleEditClick(trip)}
              className={`p-3 rounded cursor-pointer ${selectedTripId === trip.id ? 'bg-blue-100 border-blue-500 border' : 'hover:bg-gray-50 border border-transparent'}`}
            >
              <h3 className="font-semibold">{trip.name}</h3>
              <p className="text-sm text-gray-500">${trip.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Area */}
      <div className="md:col-span-2 space-y-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">{selectedTripId ? 'Edit Trip' : 'Create New Trip'}</h2>
          <form onSubmit={handleCreateOrUpdateTrip} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Trip Name</label>
              <input type="text" className="border p-2 w-full rounded" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea className="border p-2 w-full rounded" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium">Price</label>
                  <input type="number" className="border p-2 w-full rounded" value={price} onChange={e => setPrice(e.target.value)} required />
               </div>
               <div>
                  <label className="block text-sm font-medium">Image URL</label>
                  <input type="text" className="border p-2 w-full rounded" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
               </div>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {selectedTripId ? 'Update Trip' : 'Create Trip'}
            </button>
            {selectedTripId && (
               <p className="text-sm text-gray-500 mt-2">Editing Trip ID: {selectedTripId}</p>
            )}
          </form>
        </div>

        {selectedTripId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white shadow rounded-lg p-6">
               <h2 className="text-xl font-bold mb-4">Add Destination</h2>
               <form onSubmit={handleAddDest} className="space-y-4">
                  <input type="text" placeholder="Name" className="border p-2 w-full rounded" value={destName} onChange={e => setDestName(e.target.value)} required />
                  <input type="text" placeholder="Description" className="border p-2 w-full rounded" value={destDesc} onChange={e => setDestDesc(e.target.value)} />
                  <div className="grid grid-cols-2 gap-4">
                      <input type="number" step="any" placeholder="Lat" className="border p-2 w-full rounded" value={lat} onChange={e => setLat(e.target.value)} required />
                      <input type="number" step="any" placeholder="Lon" className="border p-2 w-full rounded" value={lon} onChange={e => setLon(e.target.value)} required />
                  </div>
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add Destination</button>
               </form>
             </div>
             
             <div className="bg-white shadow rounded-lg p-6">
               <h2 className="text-xl font-bold mb-4">Add Itinerary Item</h2>
               <form onSubmit={handleAddItin} className="space-y-4">
                  <input type="number" placeholder="Day Number" className="border p-2 w-full rounded" value={dayNum} onChange={e => setDayNum(e.target.value)} required />
                  <input type="text" placeholder="Title" className="border p-2 w-full rounded" value={itinTitle} onChange={e => setItinTitle(e.target.value)} required />
                  <textarea placeholder="Description" className="border p-2 w-full rounded" value={itinDesc} onChange={e => setItinDesc(e.target.value)} />
                  <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">Add Item</button>
               </form>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
