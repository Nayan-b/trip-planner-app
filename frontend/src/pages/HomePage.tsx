import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Star, DollarSign } from 'lucide-react';

interface Trip {
  id: number;
  name: string;
  price: number;
  rating: number;
  image_url?: string;
  description?: string;
}

interface FilterState {
  search: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

export function HomePage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    minPrice: 0,
    maxPrice: 10000,
    minRating: 0,
  });

  // Debounced search
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    fetchTrips();
  }, [debouncedFilters]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const params: any = {};
      
      if (debouncedFilters.search) params.search = debouncedFilters.search;
      if (debouncedFilters.minPrice > 0) params.min_price = debouncedFilters.minPrice;
      if (debouncedFilters.maxPrice < 10000) params.max_price = debouncedFilters.maxPrice;
      if (debouncedFilters.minRating > 0) params.min_rating = debouncedFilters.minRating;

      const res = await apiClient.get('/trips', { params });
      setTrips(res.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      minPrice: 0,
      maxPrice: 10000,
      minRating: 0,
    });
  };

  const hasActiveFilters = filters.search || filters.minPrice > 0 || filters.maxPrice < 10000 || filters.minRating > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Explore Amazing Trips
          </h1>
          <p className="text-gray-600 text-lg">Discover your next adventure</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search trips by name or description..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Filter Toggle and Clear Button */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                showFilters
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 hover:border-indigo-300 hover:shadow-md'
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </button>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-medium border border-red-200 hover:bg-red-100 transition-all duration-200"
              >
                <X className="h-5 w-5" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 space-y-6 animate-slideDown">
              {/* Price Range */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <DollarSign className="h-4 w-4 text-indigo-600" />
                  Price Range
                </label>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Min Price</label>
                      <input
                        type="number"
                        min="0"
                        max={filters.maxPrice}
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Max Price</label>
                      <input
                        type="number"
                        min={filters.minPrice}
                        max="10000"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                      />
                    </div>
                  </div>
                  <div className="relative pt-1">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                      className="w-full h-2 bg-gradient-to-r from-indigo-200 to-indigo-400 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                  <div className="text-center text-sm text-gray-600 font-medium">
                    ${filters.minPrice} - ${filters.maxPrice}
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  Minimum Rating
                </label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilters({ ...filters, minRating: rating })}
                      className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
                        filters.minRating === rating
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {rating === 0 ? 'All' : `${rating}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `Found ${trips.length} trip${trips.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Trips Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all duration-200 shadow-lg"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  {trip.image_url ? (
                    <img
                      src={trip.image_url}
                      alt={trip.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center">
                      <span className="text-white text-6xl font-bold opacity-20">
                        {trip.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  {/* Rating Badge */}
                  {trip.rating > 0 && (
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold text-gray-900">{trip.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {trip.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-1 text-sm leading-relaxed">
                    {trip.description || 'Discover an amazing adventure waiting for you.'}
                  </p>
                  
                  {/* Footer */}
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Starting from</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          ${Number(trip.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <Link
                      to={`/trips/${trip.id}`}
                      className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
