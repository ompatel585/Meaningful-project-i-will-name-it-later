import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { restaurantAPI } from "../api";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    city: "",
    cuisine: "",
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
      console.error("Failed to fetch restaurants:", error);
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
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Search Section */}
      <div className="bg-white shadow-lg border-b border-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">
              Find Restaurants
            </h1>
            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="flex-1">
                <input
                  type="text"
                  name="search"
                  placeholder="Search restaurants by name..."
                  value={filters.search}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-colors bg-slate-50"
                />
              </div>
              <div className="w-full md:w-48">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={filters.city}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-colors bg-slate-50"
                />
              </div>
              <div className="w-full md:w-48">
                <input
                  type="text"
                  name="cuisine"
                  placeholder="Cuisine"
                  value={filters.cuisine}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-colors bg-slate-50"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            {restaurants.length} Restaurant{restaurants.length !== 1 ? "s" : ""}{" "}
            Found
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              No Restaurants Found
            </h3>
            <p className="text-slate-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <Link
                to={`/restaurants/${restaurant._id}`}
                key={restaurant._id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-48 bg-slate-200 relative overflow-hidden">
                  {restaurant.images?.[0] ? (
                    <img
                      src={restaurant.images[0]}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                      <svg
                        className="w-16 h-16 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                  )}
                  {restaurant.isVerified && (
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verified
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {restaurant.name}
                  </h2>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      {restaurant.cuisine}
                    </span>
                    <span>•</span>
                    <span>{restaurant.location?.city || "Unknown"}</span>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                    {restaurant.description}
                  </p>
                  <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    View Details
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
