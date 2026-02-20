import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { restaurantAPI, reservationAPI } from "../api";
import { useAuth } from "../context/AuthContext";

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [reservation, setReservation] = useState({
    date: "",
    time: "",
    partySize: 2,
    specialRequests: "",
    contactPhone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const response = await restaurantAPI.getById(id);
      setRestaurant(response.data);
    } catch (error) {
      console.error("Failed to fetch restaurant:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReservationChange = (e) => {
    setReservation({
      ...reservation,
      [e.target.name]: e.target.value,
    });
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await reservationAPI.create({
        restaurantId: id,
        ...reservation,
      });
      setSuccess("Reservation created successfully!");
      setShowReservationForm(false);
      navigate("/my-reservations");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create reservation");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Restaurant not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {restaurant.name}
          </h1>
          <p className="text-gray-600">
            {restaurant.cuisine} • {restaurant.location?.city}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Image */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {restaurant.images?.[0] ? (
                <img
                  src={restaurant.images[0]}
                  alt={restaurant.name}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-gray-600">{restaurant.description}</p>
            </div>

            {/* Operating Hours */}
            {restaurant.operatingHours && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Operating Hours</h2>
                <div className="space-y-2">
                  {Object.entries(restaurant.operatingHours).map(
                    ([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="font-medium capitalize">{day}</span>
                        <span className="text-gray-600">{hours}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Tables */}
            {restaurant.tables && restaurant.tables.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Available Tables</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {restaurant.tables.map((table, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <p className="font-medium">Table {table.tableNumber}</p>
                      <p className="text-sm text-gray-600">
                        Capacity: {table.capacity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Make a Reservation</h2>

              {!isAuthenticated ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    Please login to make a reservation
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Login to Reserve
                  </button>
                </div>
              ) : showReservationForm ? (
                <form onSubmit={handleReservationSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="bg-green-100 text-green-700 p-3 rounded text-sm">
                      {success}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={reservation.date}
                      onChange={handleReservationChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <select
                      name="time"
                      required
                      value={reservation.time}
                      onChange={handleReservationChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select time</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="19:00">7:00 PM</option>
                      <option value="20:00">8:00 PM</option>
                      <option value="21:00">9:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Party Size
                    </label>
                    <select
                      name="partySize"
                      value={reservation.partySize}
                      onChange={handleReservationChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      required
                      value={reservation.contactPhone}
                      onChange={handleReservationChange}
                      placeholder="Your phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests
                    </label>
                    <textarea
                      name="specialRequests"
                      value={reservation.specialRequests}
                      onChange={handleReservationChange}
                      rows="3"
                      placeholder="Any special requests..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {submitting ? "Booking..." : "Confirm Booking"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReservationForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowReservationForm(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
                >
                  Reserve a Table
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
