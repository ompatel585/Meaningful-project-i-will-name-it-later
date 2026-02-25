import { useState, useEffect, useRef } from "react";
import { restaurantAPI, reservationAPI } from "../../api";
import toast from "react-hot-toast";
import TableLayoutEditor from "../../components/TableLayoutEditor";

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
  const [imageFiles, setImageFiles] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "Appetizer",
    isAvailable: true,
  });
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const [previewImages, setPreviewImages] = useState([]);

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
    setTables(data.tables || []);
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

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageFiles((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...previews]);

    toast.success(`${files.length} image(s) selected`);
  };

  const handleUploadImages = async () => {
    if (imageFiles.length === 0) {
      toast.error("No images to upload");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await restaurantAPI.uploadImages(formData);

      const uploadedUrls = response.data.images.map((img) => img.url);

      const updatedImages = [
        ...images.filter((img) => img.startsWith("http")),
        ...uploadedUrls,
      ];

      setImages(updatedImages);
      setImageFiles([]);
      setPreviewImages([]);

      await restaurantAPI.update(restaurant._id, {
        images: updatedImages,
      });

      toast.success("Images uploaded & saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload images");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageRemove = async (index) => {
    const imageToRemove = images[index];

    if (imageToRemove && imageToRemove.startsWith("http")) {
      try {
        await restaurantAPI.deleteImage(imageToRemove);
        toast.success("Image removed");
      } catch (err) {
        console.error("Failed to delete image from server:", err);
      }
    }

    setImages(images.filter((_, i) => i !== index));
    if (index < imageFiles.length) {
      setImageFiles(imageFiles.filter((_, i) => i !== index));
    }
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
      toast.error("Please fill in required fields (name, price, category)");
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
    toast.success("Menu item added successfully!");
  };

  const handleDeleteMenuItem = (index) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
    toast.success("Menu item removed");
  };

  const handleSaveTables = async (savedTables) => {
    setTables(savedTables);
    setSubmitting(true);
    try {
      await restaurantAPI.update(restaurant._id, { tables: savedTables });
      toast.success("Table layout saved!");
      fetchMyRestaurant();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save table layout");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        images: images.filter((img) => img.startsWith("http")),
        menu: menuItems,
        tables,
      };

      if (restaurant) {
        await restaurantAPI.update(restaurant._id, data);
        toast.success("Restaurant updated successfully!");
      } else {
        await restaurantAPI.create(data);
        toast.success("Restaurant created successfully!");
      }
      fetchMyRestaurant();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save restaurant");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (reservationId, status) => {
    try {
      await reservationAPI.updateStatus(reservationId, { status });
      fetchReservations(restaurant._id);
      toast.success(`Reservation ${status}!`);
    } catch (err) {
      toast.error("Failed to update reservation");
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

  const totalReservations = reservations.length;
  const confirmedReservations = reservations.filter(
    (r) => r.status === "confirmed",
  ).length;
  const pendingReservations = reservations.filter(
    (r) => r.status === "pending",
  ).length;
  const completedReservations = reservations.filter(
    (r) => r.status === "completed",
  ).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-2xl p-6 mb-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                {restaurant?.name || "Create Your Restaurant"}
              </h1>
              <p className="text-indigo-100 mt-1">
                {restaurant
                  ? "Manage your restaurant details"
                  : "Set up your restaurant profile"}
              </p>
            </div>
            {restaurant?.isVerified && (
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified
              </span>
            )}
          </div>

          {restaurant && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-indigo-200 text-sm">Total Reservations</p>
                <p className="text-2xl font-bold">{totalReservations}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-indigo-200 text-sm">Confirmed</p>
                <p className="text-2xl font-bold">{confirmedReservations}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-indigo-200 text-sm">Pending</p>
                <p className="text-2xl font-bold">{pendingReservations}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-indigo-200 text-sm">Completed</p>
                <p className="text-2xl font-bold">{completedReservations}</p>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="flex border-b overflow-x-auto">
            {[
              {
                id: "details",
                label: "Details",
                icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
              },
              {
                id: "photos",
                label: "Photos",
                icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
              },
              {
                id: "menu",
                label: "Menu",
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
              },
              {
                id: "hours",
                label: "Hours",
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                id: "tables",
                label: "Table Layout",
                icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
              },
              {
                id: "reservations",
                label: "Reservations",
                icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
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
                    d={tab.icon}
                  />
                </svg>
                {tab.label}
                {tab.id === "reservations" && pendingReservations > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {pendingReservations}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  Basic Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Restaurant Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Enter restaurant name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Cuisine Type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cuisine"
                      value={formData.cuisine}
                      onChange={handleChange}
                      placeholder="e.g., Italian, Chinese, Mexican"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Website (Optional)
                    </label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="www.example.com"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Describe your restaurant, atmosphere, and specialties..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </span>
                  Location
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location.address"
                      value={formData["location.address"]}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="location.city"
                      value={formData["location.city"]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      State
                    </label>
                    <input
                      type="text"
                      name="location.state"
                      value={formData["location.state"]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="location.zipCode"
                      value={formData["location.zipCode"]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Country
                    </label>
                    <input
                      type="text"
                      name="location.country"
                      value={formData["location.country"] || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/30 hover:shadow-xligo-500/40"
                >
                  hover:shadow-ind {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === "photos" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Restaurant Photos
                </h3>
                <p className="text-gray-500 mt-1">
                  Upload photos to showcase your restaurant
                </p>
              </div>
              <div className="flex gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Upload Photos
                </button>
              </div>
            </div>

            {images.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-10 h-10 text-indigo-400"
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
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  No photos yet
                </h4>
                <p className="text-gray-500 mb-4">
                  Click "Upload Photos" to add images from your device
                </p>
                <p className="text-sm text-gray-400">
                  Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...images, ...previewImages].map((url, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-xl overflow-hidden shadow-md"
                    >
                      <img
                        src={url}
                        alt={`Restaurant ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300?text=Invalid+Image";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleImageRemove(index)}
                          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-colors"
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
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  💡 The first photo will be used as the cover image
                </p>
              </>
            )}

            <div className="mt-8">
              <button
                onClick={handleUploadImages}
                disabled={submitting}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/30"
              >
                {submitting ? "Saving..." : "Save Photos"}
              </button>
            </div>
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === "menu" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Menu Management
                </h3>
                <p className="text-gray-500 mt-1">
                  Manage your restaurant menu items
                </p>
              </div>
              <button
                onClick={() => setShowMenuForm(!showMenuForm)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2"
              >
                {showMenuForm ? "Cancel" : "Add Item"}
              </button>
            </div>

            {showMenuForm && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl mb-8 border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-6">
                  Add New Menu Item
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newMenuItem.name}
                      onChange={handleMenuItemChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Margherita Pizza"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={newMenuItem.price}
                        onChange={handleMenuItemChange}
                        step="0.01"
                        min="0"
                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={newMenuItem.category}
                      onChange={handleMenuItemChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Appetizer">🥗 Appetizer</option>
                      <option value="MainCourse">🍽️ Main Course</option>
                      <option value="Dessert">🍰 Dessert</option>
                      <option value="Beverage">🍹 Beverage</option>
                      <option value="SideDish">🥔 Side Dish</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={newMenuItem.isAvailable}
                        onChange={handleMenuItemChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-12 h-6 rounded-full transition-colors ${newMenuItem.isAvailable ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${newMenuItem.isAvailable ? "translate-x-6" : "translate-x-0"}`}
                      ></div>
                      <span className="ml-3 text-sm font-semibold text-gray-700">
                        {newMenuItem.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </label>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={newMenuItem.description}
                      onChange={handleMenuItemChange}
                      rows="2"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Describe the dish..."
                    ></textarea>
                  </div>
                </div>
                <button
                  onClick={handleAddMenuItem}
                  className="mt-6 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition-all"
                >
                  Add to Menu
                </button>
              </div>
            )}

            {menuItems.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  No menu items yet
                </h4>
                <p className="text-gray-500">
                  Start building your menu by adding items
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-gray-900">
                            {item.name}
                          </h4>
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${getMenuCategoryColor(item.category)}`}
                          >
                            {item.category}
                          </span>
                          {!item.isAvailable && (
                            <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-800 font-medium">
                              Unavailable
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-500 mt-2">
                            {item.description}
                          </p>
                        )}
                        <p className="font-bold text-xl text-indigo-600 mt-3">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteMenuItem(index)}
                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl transition-colors"
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
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/30"
              >
                {submitting ? "Saving..." : "Save Menu"}
              </button>
            </div>
          </div>
        )}

        {/* Tables Tab */}
        {activeTab === "tables" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">Table Layout</h3>
              <p className="text-gray-500 mt-1">
                Design your restaurant's floor plan and manage tables
              </p>
            </div>

            <TableLayoutEditor tables={tables} onSave={handleSaveTables} />
          </div>
        )}

        {/* Hours Tab */}
        {activeTab === "hours" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Operating Hours
              </h3>
              <p className="text-gray-500 mt-1">
                Set your restaurant's opening and closing times
              </p>
            </div>
            <div className="space-y-4">
              {[
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
              ].map((day) => (
                <div
                  key={day}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <label className="w-28 capitalize text-sm font-bold text-gray-700">
                    {day}
                  </label>
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="time"
                      value={formData[`operatingHours.${day}`]?.open || ""}
                      onChange={(e) =>
                        handleHoursChange(day, "open", e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="time"
                      value={formData[`operatingHours.${day}`]?.close || ""}
                      onChange={(e) =>
                        handleHoursChange(day, "close", e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!formData[`operatingHours.${day}`]?.isClosed}
                      onChange={(e) =>
                        handleHoursChange(day, "isClosed", !e.target.checked)
                      }
                      className="sr-only"
                    />
                    <div
                      className={`w-10 h-5 rounded-full transition-colors ${!formData[`operatingHours.${day}`]?.isClosed ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                    <span
                      className={`ml-2 text-xs font-medium ${!formData[`operatingHours.${day}`]?.isClosed ? "text-green-600" : "text-gray-500"}`}
                    >
                      {!formData[`operatingHours.${day}`]?.isClosed
                        ? "Open"
                        : "Closed"}
                    </span>
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/30"
              >
                {submitting ? "Saving..." : "Save Hours"}
              </button>
            </div>
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === "reservations" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Reservations
                </h3>
                <p className="text-gray-500 mt-1">
                  Manage table bookings for your restaurant
                </p>
              </div>
              <div className="flex gap-2">
                <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {pendingReservations} Pending
                </span>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {confirmedReservations} Confirmed
                </span>
              </div>
            </div>

            {reservations.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  No reservations yet
                </h4>
                <p className="text-gray-500">
                  Reservations will appear here when customers book tables
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div
                    key={reservation._id}
                    className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {reservation.userId?.name
                              ?.charAt(0)
                              .toUpperCase() || "?"}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {reservation.userId?.name || "Guest User"}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {reservation.userId?.email || "No email"}
                            </p>
                          </div>
                          <span
                            className={`ml-4 px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(reservation.status)}`}
                          >
                            {reservation.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg
                              className="w-5 h-5 text-indigo-500"
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
                            <span className="font-medium">
                              {new Date(reservation.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg
                              className="w-5 h-5 text-indigo-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="font-medium">
                              {reservation.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg
                              className="w-5 h-5 text-indigo-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span className="font-medium">
                              {reservation.partySize} guests
                            </span>
                          </div>
                          {reservation.tableNumber && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <svg
                                className="w-5 h-5 text-indigo-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                              </svg>
                              <span className="font-medium">
                                Table {reservation.tableNumber}
                              </span>
                            </div>
                          )}
                        </div>
                        {reservation.specialRequests && (
                          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-sm text-yellow-800">
                              <span className="font-semibold">
                                📝 Special Request:
                              </span>{" "}
                              {reservation.specialRequests}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {reservation.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateStatus(reservation._id, "confirmed")
                              }
                              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(reservation._id, "cancelled")
                              }
                              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors"
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
                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors"
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
