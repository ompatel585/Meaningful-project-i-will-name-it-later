import { useState, useEffect } from "react";
import { reservationAPI } from "../api";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await reservationAPI.getAll();
      setReservations(response.data);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    setCancelling(id);
    try {
      await reservationAPI.cancel(id);
      fetchReservations();
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
    } finally {
      setCancelling(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          My Reservations
        </h1>

        {reservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              You don't have any reservations yet
            </p>
            <a
              href="/restaurants"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Browse Restaurants
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation._id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold">
                        {reservation.restaurantId?.name || "Restaurant"}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}
                      >
                        {reservation.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">
                      {reservation.restaurantId?.location?.city || ""}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                      <span>📅 {formatDate(reservation.date)}</span>
                      <span>🕒 {reservation.time}</span>
                      <span>👥 {reservation.partySize} guests</span>
                    </div>
                    {reservation.tableNumber && (
                      <p className="text-sm text-gray-600 mt-1">
                        Table: {reservation.tableNumber}
                      </p>
                    )}
                    {reservation.specialRequests && (
                      <p className="text-sm text-gray-500 mt-2 italic">
                        Note: {reservation.specialRequests}
                      </p>
                    )}
                  </div>

                  {reservation.status !== "cancelled" &&
                    reservation.status !== "completed" && (
                      <div className="mt-4 md:mt-0">
                        <button
                          onClick={() => handleCancel(reservation._id)}
                          disabled={cancelling === reservation._id}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
                        >
                          {cancelling === reservation._id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;
