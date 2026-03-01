import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { restaurantAPI } from "../../api";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    city: "",
    cuisine: "",
    priceRange: "",
    minRating: "",
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
            <form onSubmit={handleSearch}>
              {/* Basic Search Row */}
              <div className="flex flex-col md:flex-row gap-4 mb-4">
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
                <div className="w-full md:w-40">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={filters.city}
                    onChange={handleChange}
                    className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-colors bg-slate-50"
                  />
                </div>
                <div className="w-full md:w-40">
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
              </div>

              {/* Advanced Filters Toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
              >
                <svg
                  className={`w-5 h-5 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                {showAdvanced ? "Hide" : "Show"} Advanced Filters
              </button>

              {/* Advanced Filters Row */}
              {showAdvanced && (
                <div className="flex flex-col md:flex-row gap-4 mt-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-full md:w-48">
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Price Range
                    </label>
                    <select
                      name="priceRange"
                      value={filters.priceRange}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors bg-white"
                    >
                      <option value="">All Prices</option>
                      <option value="1">$ (Budget)</option>
                      <option value="2">$$ (Moderate)</option>
                      <option value="3">$$$ (Upscale)</option>
                      <option value="4">$$$$ (Fine Dining)</option>
                      <option value="1,2">$ - $$</option>
                      <option value="2,3">$$ - $$$</option>
                      <option value="3,4">$$$ - $$$$</option>
                    </select>
                  </div>
                  <div className="w-full md:w-48">
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Minimum Rating
                    </label>
                    <select
                      name="minRating"
                      value={filters.minRating}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors bg-white"
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3">3+ Stars</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() =>
                        setFilters({
                          search: "",
                          city: "",
                          cuisine: "",
                          priceRange: "",
                          minRating: "",
                        })
                      }
                      className="px-6 py-3 bg-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-300 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
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
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-3 flex-wrap">
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      {restaurant.cuisine}
                    </span>
                    <span>•</span>
                    <span className="text-amber-600 font-medium">
                      {"$".repeat(restaurant.priceRange || 2)}
                    </span>
                    {restaurant.averageRating > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-600">
                          <svg
                            className="w-4 h-4 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {restaurant.averageRating.toFixed(1)}
                        </span>
                      </>
                    )}
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
