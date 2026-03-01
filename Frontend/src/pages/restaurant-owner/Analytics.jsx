import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { analyticsAPI } from "../../api";

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const days = parseInt(dateRange);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const params = {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      };

      // For restaurant owners - fetch their restaurant analytics
      if (user?.role === "restaurant_owner") {
        const response = await analyticsAPI.getAnalytics(params);
        setAnalytics(response.data);
      }
      // For admins - fetch admin/platform analytics
      else if (user?.role === "super_admin") {
        const response = await analyticsAPI.getAdminAnalytics(params);
        setAnalytics(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError(err.response?.data?.message || err.message);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  const getPriceRangeLabel = (range) => {
    const labels = { 1: "$", 2: "$$", 3: "$$$", 4: "$$$$" };
    return labels[range] || "$$";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Access denied message
  if (
    !user ||
    (user.role !== "restaurant_owner" && user.role !== "super_admin")
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Access Denied
          </h2>
          <p className="text-slate-600 mb-6">
            You don't have permission to view this page.
          </p>
          <Link to="/dashboard" className="text-indigo-600 hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              {analytics?.isAdmin
                ? "Platform Analytics"
                : "Analytics Dashboard"}
            </h1>
            <p className="text-slate-500 mt-1">
              {analytics?.restaurant?.name || "Restaurant Analytics"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            Error: {error}
          </div>
        )}

        {!analytics && !error && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl">
            No analytics data available. Please make sure you have a restaurant
            registered.
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-purple-500">
            <p className="text-slate-500 text-sm">Total Reservations</p>
            <p className="text-2xl md:text-3xl font-bold text-slate-800">
              {analytics?.summary?.totalReservations || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-emerald-500">
            <p className="text-slate-500 text-sm">Total Guests</p>
            <p className="text-2xl md:text-3xl font-bold text-slate-800">
              {analytics?.summary?.totalGuests || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-amber-500">
            <p className="text-slate-500 text-sm">Average Rating</p>
            <p className="text-2xl md:text-3xl font-bold text-slate-800">
              {analytics?.summary?.averageRating || "0.0"}★
            </p>
          </div>
          {analytics?.isAdmin ? (
            <>
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-blue-500">
                <p className="text-slate-500 text-sm">Total Restaurants</p>
                <p className="text-2xl md:text-3xl font-bold text-slate-800">
                  {analytics?.summary?.totalRestaurants || 0}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-pink-500">
                <p className="text-slate-500 text-sm">Total Users</p>
                <p className="text-2xl md:text-3xl font-bold text-slate-800">
                  {analytics?.summary?.totalUsers || 0}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-orange-500">
                <p className="text-slate-500 text-sm">Pending Applications</p>
                <p className="text-2xl md:text-3xl font-bold text-slate-800">
                  {analytics?.summary?.pendingApplications || 0}
                </p>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-blue-500">
              <p className="text-slate-500 text-sm">Total Reviews</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-800">
                {analytics?.summary?.totalReviews || 0}
              </p>
            </div>
          )}
        </div>

        {/* Top 3 Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Top 3 Dishes */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </span>
              Top Dishes
            </h3>
            <div className="space-y-3">
              {analytics?.top3Dishes?.length > 0 ? (
                analytics.top3Dishes.map((dish, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {dish.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {dish.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-indigo-600">
                        {dish.orders} orders
                      </p>
                      <p className="text-xs text-slate-500">${dish.revenue}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No data available</p>
              )}
            </div>
          </div>

          {/* Top 3 Cuisine Types */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Top Cuisines
            </h3>
            <div className="space-y-3">
              {analytics?.top3Cuisines?.length > 0 ? (
                analytics.top3Cuisines.map((cuisine, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {cuisine.cuisine}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">
                        {cuisine.reservations}{" "}
                        {analytics?.isAdmin ? "restaurants" : "reservations"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {cuisine.percentage}%
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No data available</p>
              )}
            </div>
          </div>

          {/* By Time Slot */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              By Time Slot
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {analytics?.byTimeSlot?.length > 0 ? (
                analytics.byTimeSlot.slice(0, 5).map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                  >
                    <span className="font-semibold text-slate-800">
                      {slot.time}
                    </span>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">
                        {slot.reservations} reservations
                      </p>
                      <p className="text-xs text-slate-500">
                        {slot.guests} guests
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* By Date */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Reservations by Date
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {analytics?.byDate?.length > 0 ? (
                analytics.byDate.slice(-7).map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                  >
                    <span className="text-slate-600">{day._id}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-emerald-600 font-medium">
                        {day.confirmed} ✓
                      </span>
                      <span className="text-amber-600 font-medium">
                        {day.cancelled} ✕
                      </span>
                      <span className="font-bold text-indigo-600">
                        {day.count} total
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No data available</p>
              )}
            </div>
          </div>

          {/* By Party Size */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              By Party Size
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {analytics?.byPartySize?.length > 0 ? (
                analytics.byPartySize.map((size, index) => (
                  <div
                    key={index}
                    className="p-3 bg-slate-50 rounded-xl text-center"
                  >
                    <p className="text-2xl font-bold text-indigo-600">
                      {size._id}
                    </p>
                    <p className="text-xs text-slate-500">guests</p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {size.count} reservations
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm col-span-3">
                  No data available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* By Cuisine Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              By Cuisine Type
            </h3>
            <div className="space-y-3">
              {analytics?.byCuisine?.length > 0 ? (
                analytics.byCuisine.map((cuisine, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-800">
                        {cuisine.cuisine}
                      </span>
                      <span className="text-indigo-600 font-bold">
                        {cuisine.count}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${cuisine.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No data available</p>
              )}
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Reservation Status
            </h3>
            <div className="space-y-3">
              {analytics?.byStatus?.length > 0 ? (
                analytics.byStatus.map((status, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                  >
                    <span className="font-semibold text-slate-800 capitalize">
                      {status._id}
                    </span>
                    <span className="font-bold text-indigo-600">
                      {status.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Restaurant Info */}
        {analytics?.restaurant && (
          <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-bold mb-2">
              {analytics?.isAdmin
                ? "Platform Information"
                : "Restaurant Information"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-indigo-200 text-sm">
                  {analytics?.isAdmin ? "Total Restaurants" : "Restaurant Name"}
                </p>
                <p className="font-semibold">
                  {analytics?.isAdmin
                    ? analytics?.summary?.totalRestaurants
                    : analytics.restaurant.name}
                </p>
              </div>
              <div>
                <p className="text-indigo-200 text-sm">Cuisine</p>
                <p className="font-semibold">{analytics.restaurant.cuisine}</p>
              </div>
              <div>
                <p className="text-indigo-200 text-sm">Price Range</p>
                <p className="font-semibold">
                  {getPriceRangeLabel(analytics.restaurant.priceRange)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
