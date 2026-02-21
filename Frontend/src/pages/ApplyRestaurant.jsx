import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { applicationAPI } from "../api";

const ApplyRestaurant = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [existingApplication, setExistingApplication] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: user?.name || "",
    phone: "",
    email: user?.email || "",
    address: "",
    cuisine: "",
    description: "",
    licenseNumber: "",
  });

  useEffect(() => {
    checkApplicationStatus();
  }, []);

  const checkApplicationStatus = async () => {
    try {
      const response = await applicationAPI.getMyApplication();
      if (response.data.hasApplication) {
        setExistingApplication(response.data.application);
      }
    } catch (err) {
      // No application found - that's fine
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await applicationAPI.apply(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is already a restaurant owner
  if (user?.role === "restaurant_owner") {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              You are a Restaurant Owner
            </h2>
            <p className="text-gray-600 mb-6">
              You already have restaurant owner privileges.
            </p>
            <button
              onClick={() => navigate("/manage-restaurant")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Manage My Restaurant
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user has existing application
  if (existingApplication) {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Application Status
          </h2>

          <div className="mb-6">
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${statusColors[existingApplication.status]}`}
            >
              {existingApplication.status.charAt(0).toUpperCase() +
                existingApplication.status.slice(1)}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Restaurant Name</p>
              <p className="font-medium">
                {existingApplication.restaurantName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Submitted On</p>
              <p className="font-medium">
                {new Date(existingApplication.createdAt).toLocaleDateString()}
              </p>
            </div>
            {existingApplication.status === "rejected" &&
              existingApplication.adminNotes && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">
                    Rejection Reason:
                  </p>
                  <p className="text-red-700">
                    {existingApplication.adminNotes}
                  </p>
                </div>
              )}
          </div>

          {existingApplication.status === "pending" && (
            <p className="mt-6 text-gray-600">
              Your application is pending review. You will be notified once it's
              reviewed by an administrator.
            </p>
          )}

          {existingApplication.status === "approved" && (
            <button
              onClick={() => navigate("/manage-restaurant")}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Restaurant Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Apply as Restaurant Owner
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="restaurantName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Restaurant Name *
            </label>
            <input
              type="text"
              id="restaurantName"
              name="restaurantName"
              required
              value={formData.restaurantName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter restaurant name"
            />
          </div>

          <div>
            <label
              htmlFor="ownerName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Owner Full Name *
            </label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              required
              value={formData.ownerName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter owner full name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Restaurant Address *
            </label>
            <textarea
              id="address"
              name="address"
              required
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter full restaurant address"
            />
          </div>

          <div>
            <label
              htmlFor="cuisine"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cuisine Type *
            </label>
            <input
              type="text"
              id="cuisine"
              name="cuisine"
              required
              value={formData.cuisine}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Italian, Chinese, Indian"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Restaurant Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your restaurant"
            />
          </div>

          <div>
            <label
              htmlFor="licenseNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              GST / License Number *
            </label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              required
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter GST or business license number"
            />
          </div>

          <div className="border-t pt-6">
            <p className="text-sm text-gray-500 mb-4">
              Business proof document upload placeholder - In production, this
              would be a file upload field
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyRestaurant;
