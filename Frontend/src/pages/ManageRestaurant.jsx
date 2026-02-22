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
  const [images, setImages] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "Appetizer",
    isAvailable: true,
  });
  const [showMenuForm, setShowMenuForm] = useState(false);
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

    setImages(data.images || []);
    setMenuItems(data.menu || []);
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

  const handleImageUrlAdd = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setImages([...images, url]);
    }
  };

  const handleImageRemove = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleMenuItemChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMenuItem({
      ...newMenuItem,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.price || !newMenuItem.category) {
      setError("Please fill in required fields (name, price, category)");
      return;
    }
    setMenuItems([
      ...menuItems,
      { ...newMenuItem, price: parseFloat(newMenuItem.price) },
    ]);
    setNewMenuItem({
      name: "",
      description: "",
      price: "",
      category: "Appetizer",
      isAvailable: true,
    });
    setShowMenuForm(false);
    setError("");
  };

  const handleDeleteMenuItem = (index) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
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
        images,
        menu: menuItems,
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

  const getMenuCategoryColor = (category) => {
    const colors = {
      Appetizer: "bg-blue-100 text-blue-800",
      MainCourse: "bg-green-100 text-green-800",
      Dessert: "bg-purple-100 text-purple-800",
      Beverage: "bg-yellow-100 text-yellow-800",
      SideDish: "bg-orange-100 text-orange-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
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
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === "details"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Restaurant Details
            </button>
            <button
              onClick={() => setActiveTab("photos")}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === "photos"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === "menu"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => setActiveTab("hours")}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === "hours"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Opening Hours
            </button>
            <button
              onClick={() => setActiveTab("reservations")}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === "reservations"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
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
                      Restaurant Name *
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
                      Cuisine Type *
                    </label>
                    <input
                      type="text"
                      name="cuisine"
                      value={formData.cuisine}
                      onChange={handleChange}
                      placeholder="e.g., Italian, Chinese, Mexican"
                      required
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
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Location</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="location.address"
                      value={formData["location.address"]}
                      onChange={handleChange}
                      required
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

        {/* Photos Tab */}
        {activeTab === "photos" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Restaurant Photos</h3>
              <button
                onClick={handleImageUrlAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add Photo URL
              </button>
            </div>

            {images.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-500">No photos added yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Add photo URLs to showcase your restaurant
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Restaurant ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=Invalid+Image+URL";
                      }}
                    />
                    <button
                      onClick={() => handleImageRemove(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Photos"}
              </button>
            </div>
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === "menu" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Menu Management</h3>
              <button
                onClick={() => setShowMenuForm(!showMenuForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {showMenuForm ? "Cancel" : "Add Menu Item"}
              </button>
            </div>

            {/* Add Menu Item Form */}
            {showMenuForm && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium mb-4">Add New Menu Item</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newMenuItem.name}
                      onChange={handleMenuItemChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Margherita Pizza"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={newMenuItem.price}
                      onChange={handleMenuItemChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={newMenuItem.category}
                      onChange={handleMenuItemChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Appetizer">Appetizer</option>
                      <option value="MainCourse">Main Course</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Beverage">Beverage</option>
                      <option value="SideDish">Side Dish</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={newMenuItem.isAvailable}
                      onChange={handleMenuItemChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Available for order
                    </label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={newMenuItem.description}
                      onChange={handleMenuItemChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the dish..."
                    ></textarea>
                  </div>
                </div>
                <button
                  onClick={handleAddMenuItem}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Add Item
                </button>
              </div>
            )}

            {/* Menu Items List */}
            {menuItems.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-gray-500">No menu items yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Add items to showcase your menu
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">
                          {item.name}
                        </h4>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${getMenuCategoryColor(
                            item.category,
                          )}`}
                        >
                          {item.category}
                        </span>
                        {!item.isAvailable && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                            Unavailable
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {item.description}
                        </p>
                      )}
                      <p className="font-medium text-blue-600 mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteMenuItem(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Menu"}
              </button>
            </div>
          </div>
        )}

        {/* Hours Tab */}
        {activeTab === "hours" && (
          <div className="bg-white rounded-lg shadow-md p-6">
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

            <div className="mt-6">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Hours"}
              </button>
            </div>
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
                            className={`px-2 py-1 rounded text-xs ${getStatusColor(
                              reservation.status,
                            )}`}
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
