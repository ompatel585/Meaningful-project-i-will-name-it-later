import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoyaltyInfo, selectLoyalty } from "../../store/slices/userSlice";
import { reservationAPI } from "../../api";

const UserDashboard = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const loyalty = useSelector(selectLoyalty);
  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);

  useEffect(() => {
    dispatch(fetchLoyaltyInfo());
    fetchUpcomingReservations();
  }, [dispatch]);

  const fetchUpcomingReservations = async () => {
    try {
      const response = await reservationAPI.getAll({
        status: "confirmed,pending",
      });
      // Filter to get only future reservations
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const futureReservations = response.data.filter((res) => {
        const resDate = new Date(res.date);
        return resDate >= today && res.status !== "cancelled";
      });
      setUpcomingReservations(futureReservations.slice(0, 3)); // Limit to 3
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setLoadingReservations(false);
    }
  };

  // Get tier badge color
  const getTierColor = (tier) => {
    const colors = {
      Bronze: "from-amber-700 to-amber-900",
      Silver: "from-gray-400 to-gray-600",
      Gold: "from-yellow-400 to-yellow-600",
      Platinum: "from-purple-400 to-purple-600",
      Diamond: "from-cyan-400 to-blue-500",
    };
    return colors[tier] || colors.Bronze;
  };

  // Calculate progress to next tier
  const getNextTierPoints = (tier) => {
    const tiers = {
      Bronze: 200,
      Silver: 400,
      Gold: 600,
      Platinum: 800,
      Diamond: 1000,
    };
    return tiers[tier] || 1000;
  };

  const progressPercent = Math.min(
    ((loyalty.loyaltyPoints || 0) /
      getNextTierPoints(loyalty.loyaltyTier || "Bronze")) *
      100,
    100,
  );
  const pointsToNext =
    getNextTierPoints(loyalty.loyaltyTier || "Bronze") -
    (loyalty.loyaltyPoints || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div
          className={`rounded-2xl shadow-2xl p-8 mb-8 text-white ${
            user?.role === "user"
              ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"
              : user?.role === "restaurant_owner"
                ? "bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500"
                : "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800"
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-indigo-100 text-lg flex items-center gap-2">
                {user?.role === "user" ? (
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getTierColor(user?.loyaltyTier || "Bronze")}`}
                  >
                    {user?.loyaltyTier || "Bronze"} MEMBER
                  </span>
                ) : user?.role === "restaurant_owner" ? (
                  <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-medium">
                    RESTAURANT PARTNER
                  </span>
                ) : (
                  <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-medium">
                    ADMINISTRATOR
                  </span>
                )}
              </p>
              <p className="text-indigo-200 mt-2">
                {user?.role === "user"
                  ? "Discover and book amazing dining experiences"
                  : user?.role === "restaurant_owner"
                    ? "Welcome restaurant manager"
                    : "Welcome Super admin"}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-5xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
          {/* Loyalty Points - Featured */}
          <Link
            to="/loyalty"
            className="bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-xl shadow-lg p-4 md:p-6 text-white col-span-2 lg:col-span-2 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-xs md:text-sm font-medium">
                  🎯 Loyalty Points
                </p>
                <p className="text-3xl md:text-4xl font-bold mt-1">
                  {loyalty.loyaltyPoints || 0}
                </p>
                <p className="text-amber-100 text-xs mt-1">
                  {loyalty.loyaltyTier || "Bronze"} Member
                </p>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-3xl md:text-4xl">🏆</span>
              </div>
            </div>
            <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-white/80 text-xs mt-2">
              {pointsToNext > 0
                ? `${pointsToNext} points to next tier`
                : "Max tier reached!"}
            </p>
          </Link>

          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs md:text-sm">
                  Total Bookings
                </p>
                <p className="text-2xl md:text-3xl font-bold text-slate-800">
                  {loyalty.totalReservations || 0}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs md:text-sm">Upcoming</p>
                <p className="text-2xl md:text-3xl font-bold text-slate-800">
                  {upcomingReservations.length}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs md:text-sm">Favorites</p>
                <p className="text-2xl md:text-3xl font-bold text-slate-800">
                  5
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/loyalty"
            className="group bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 hover:-translate-y-2"
          >
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Loyalty Program
            </h3>
            <p className="text-amber-100 text-sm">View points & achievements</p>
          </Link>

          <Link
            to="/restaurants"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 hover:-translate-y-2 border border-slate-100"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg
                className="w-7 h-7 text-white"
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
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              Browse Restaurants
            </h3>
            <p className="text-slate-500 text-sm">
              Discover restaurants near you
            </p>
          </Link>

          <Link
            to="/my-reservations"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 hover:-translate-y-2 border border-slate-100"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              My Reservations
            </h3>
            <p className="text-slate-500 text-sm">
              View and manage your bookings
            </p>
          </Link>

          <Link
            to="/apply-restaurant"
            className="group bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 hover:-translate-y-2"
          >
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Become a Partner
            </h3>
            <p className="text-purple-100 text-sm">
              List your restaurant with us
            </p>
          </Link>
        </div>

        {/* Upcoming Reservations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Upcoming Reservations
          </h2>
          {loadingReservations ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <p className="text-slate-500">Loading reservations...</p>
            </div>
          ) : upcomingReservations.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {upcomingReservations.map((reservation) => {
                const reservationDate = new Date(reservation.date);
                const month = reservationDate
                  .toLocaleString("default", { month: "short" })
                  .toUpperCase();
                const day = reservationDate.getDate();

                return (
                  <div
                    key={reservation._id}
                    className="p-4 md:p-6 border-b border-slate-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {month}
                            <br />
                            {day}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {reservation.restaurantId?.name || "Restaurant"}
                          </p>
                          <p className="text-sm text-slate-500">
                            {reservation.time} • {reservation.partySize} guests
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            reservation.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-700"
                              : reservation.status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {reservation.status?.charAt(0).toUpperCase() +
                            reservation.status?.slice(1) || "Unknown"}
                        </span>
                        <button className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <p className="text-slate-500 mb-4">No upcoming reservations</p>
              <Link
                to="/restaurants"
                className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse Restaurants
              </Link>
            </div>
          )}
        </div>

        {/* Popular Cuisines */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Popular Cuisines
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              {
                name: "Italian",
                icon: "🍝",
                color: "from-red-500 to-rose-600",
              },
              {
                name: "Japanese",
                icon: "🍣",
                color: "from-pink-500 to-rose-600",
              },
              {
                name: "Chinese",
                icon: "🥡",
                color: "from-amber-500 to-orange-600",
              },
              {
                name: "Indian",
                icon: "🍛",
                color: "from-orange-500 to-amber-600",
              },
              {
                name: "Mexican",
                icon: "🌮",
                color: "from-green-500 to-emerald-600",
              },
              {
                name: "French",
                icon: "🥐",
                color: "from-blue-500 to-indigo-600",
              },
            ].map((cuisine, index) => (
              <Link
                key={index}
                to={`/restaurants?cuisine=${cuisine.name}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl p-4 text-center transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${cuisine.color} rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}
                >
                  <span className="text-2xl">{cuisine.icon}</span>
                </div>
                <p className="font-medium text-slate-800 text-sm">
                  {cuisine.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
