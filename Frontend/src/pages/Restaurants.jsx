import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../api';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    cuisine: ''
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async (filterParams = {}) => {
    try {
      setLoading(true);
      const response = await restaurantAPI.getAll(filterParams);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants(filters);
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <div className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <input
              type="text"
              name="search"
              placeholder="Search restaurants..."
              value={filters.search}
              onChange={handleChange}
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={filters.city}
              onChange={handleChange}
              className="w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="cuisine"
              placeholder="Cuisine"
              value={filters.cuisine}
              onChange={handleChange}
              className="w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Restaurants List */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Restaurants</h1>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No restaurants found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div key={restaurant._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200">
                  {restaurant.images?.[0] ? (
                    <img
                      src={restaurant.images[0]}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {restaurant.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-2">
                    {restaurant.cuisine} • {restaurant.location?.city}
                  </p>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {restaurant.description}
                  </p>
                  <Link
                    to={`/restaurants/${restaurant._id}`}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
