import { useState, useEffect } from "react";
import { restaurantAPI, reservationAPI } from "../api";

const ManageRestaurant = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    "location.address": "",
    "location.city": "",
    "location.state": "",
    "location.zipCode": "",
    cuisine: "",
    phone: "",
    "operatingHours.monday": { open: "", close: "", isClosed: false },
    "operatingHours.tuesday": { open: "", close: "", isClosed: false },
    "operatingHours.wednesday": { open: "", close: "", isClosed: false },
    "operatingHours.thursday": { open: "", close: "", isClosed: false },
    "operatingHours.friday": { open: "", close: "", isClosed: false },
    "operatingHours.saturday": { open: "", close: "", isClosed: false },
    "operatingHours.sunday": { open: "", close: "", isClosed: false },
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyRestaurant();
  }, []);

  const fetchMyRestaurant = async () => {
    try {
      const response = await restaurantAPI.getMyRestaurant();
      setRestaurant(response.data);
      populateFormData(response.data);
      fetchReservations(response.data._id);
    } catch (err) {
      console.error("No restaurant found or error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async (restaurantId) => {
    try {
      const response = await reservationAPI.getAll({ restaurantId });
      setReservations(response.data);
    } catch (err) {
      console.error("Failed to fetch reservations:", err);
    }
  };

  const populateFormData = (data) => {
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const hours = {};
    days.forEach((day) => {
      hours[`operatingHours.${day}`] = data.operatingHours?.[day] || {
        open: "",
        close: "",
        isClosed: false,
      };
    });

    setFormData({
      name: data.name || "",
      description: data.description || "",
      "location.address": data.location?.address || "",
      "location.city": data.location?.city || "",
      "location.state": data.location?.state || "",
      "location.zipCode": data.location?.zipCode || "",
      cuisine: data.cuisine || "",
      phone: data.phone || "",
      ...hours,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleHoursChange = (day, field, value) => {
    setFormData({
      ...formData,
      [`operatingHours.${day}`]: {
        ...formData[`operatingHours.${day}`],
        [field]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const weekDays = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      const operatingHours = {};
      weekDays.forEach((day) => {
        operatingHours[day] = formData[`operatingHours.${day}`];
      });

      const data = {
        name: formData.name,
        description: formData.description,
        location: {
          address: formData["location.address"],
          city: formData["location.city"],
          state: formData["location.state"],
          zipCode: formData["location.zipCode"],
        },
        cuisine: formData.cuisine,
        phone: formData.phone,
        operatingHours,
      };

      if (restaurant) {
        await restaurantAPI.update(restaurant._id, data);
      } else {
        await restaurantAPI.create(data);
      }

      setSuccess("Restaurant details saved successfully!");
      fetchMyRestaurant();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save restaurant");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (reservationId, status) => {
    try {
      await reservationAPI.updateStatus(reservationId, { status });
      fetchReservations(restaurant._id);
    } catch (err) {
      console.error("Failed to update reservation:", err);
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Restaurant
          </h1>
          {restaurant?.isVerified && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              ✓ Verified
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-3 font-medium ${activeTab === "details" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
            >
              Restaurant Details
            </button>
            <button
              onClick={() => setActiveTab("reservations")}
              className={`px-6 py-3 font-medium ${activeTab === "reservations" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
            >
              Reservations
            </button>
          </div>
        </div>

        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Basic Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cuisine Type
                    </label>
                    <input
                      type="text"
                      name="cuisine"
                      value={formData.cuisine}
                      onChange={handleChange}
                      placeholder="e.g., Italian, Chinese, Mexican"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Location</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="location.address"
                      value={formData["location.address"]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="location.city"
                      value={formData["location.city"]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="location.state"
                      value={formData["location.state"]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="location.zipCode"
                      value={formData["location.zipCode"]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Operating Hours</h3>
                <div className="space-y-3">
                  {[
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                  ].map((day) => (
                    <div key={day} className="flex items-center gap-4">
                      <label className="w-28 capitalize text-sm font-medium text-gray-700">
                        {day}
                      </label>
                      <input
                        type="text"
                        value={formData[`operatingHours.${day}`]?.open || ""}
                        onChange={(e) =>
                          handleHoursChange(day, "open", e.target.value)
                        }
                        placeholder="Open (e.g., 9:00 AM)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="text"
                        value={formData[`operatingHours.${day}`]?.close || ""}
                        onChange={(e) =>
                          handleHoursChange(day, "close", e.target.value)
                        }
                        placeholder="Close (e.g., 10:00 PM)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === "reservations" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Reservations</h3>
            {reservations.length === 0 ? (
              <p className="text-gray-600">No reservations yet</p>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div key={reservation._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            {reservation.userId?.name || "Customer"}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${getStatusColor(reservation.status)}`}
                          >
                            {reservation.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {reservation.userId?.email}
                        </p>
                        <p className="text-sm mt-1">
                          📅 {new Date(reservation.date).toLocaleDateString()}{" "}
                          at {reservation.time}
                        </p>
                        <p className="text-sm">
                          👥 {reservation.partySize} guests
                        </p>
                        {reservation.specialRequests && (
                          <p className="text-sm text-gray-500 mt-1">
                            Note: {reservation.specialRequests}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {reservation.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateStatus(reservation._id, "confirmed")
                              }
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(reservation._id, "cancelled")
                              }
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {reservation.status === "confirmed" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(reservation._id, "completed")
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRestaurant;
