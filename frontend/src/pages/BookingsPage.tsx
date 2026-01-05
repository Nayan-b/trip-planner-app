import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

interface Booking {
    id: number;
    trip_id: number;
    status: string;
    total_price: number;
    created_at: string;
}

export function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        apiClient.get('/bookings/').then(res => setBookings(res.data)).catch(console.error);
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {bookings.map(booking => (
                        <li key={booking.id} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-blue-600 truncate">Booking #{booking.id}</p>
                                <div className="ml-2 flex-shrink-0 flex">
                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {booking.status}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                    <p className="flex items-center text-sm text-gray-500">
                                        Trip ID: {booking.trip_id}
                                    </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                    <p>
                                        Date: {new Date(booking.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                    {bookings.length === 0 && <li className="px-4 py-4">No bookings found.</li>}
                </ul>
            </div>
        </div>
    );
}
