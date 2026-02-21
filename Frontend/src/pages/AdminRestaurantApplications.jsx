import { useState, useEffect } from "react";
import { applicationAPI } from "../api";

const AdminRestaurantApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [notesModal, setNotesModal] = useState({
    open: false,
    applicationId: null,
    action: "",
  });
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      const response = await applicationAPI.getAllApplications({
        status: filter,
      });
      setApplications(response.data.applications);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setProcessing(notesModal.applicationId);
    try {
      await applicationAPI.approveApplication(notesModal.applicationId, notes);
      setNotesModal({ open: false, applicationId: null, action: "" });
      setNotes("");
      fetchApplications();
    } catch (error) {
      console.error("Failed to approve application:", error);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    setProcessing(notesModal.applicationId);
    try {
      await applicationAPI.rejectApplication(notesModal.applicationId, notes);
      setNotesModal({ open: false, applicationId: null, action: "" });
      setNotes("");
      fetchApplications();
    } catch (error) {
      console.error("Failed to reject application:", error);
    } finally {
      setProcessing(null);
    }
  };

  const openModal = (applicationId, action) => {
    setNotesModal({ open: true, applicationId, action });
    setNotes("");
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Restaurant Applications
        </h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {["pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium capitalize ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No {filter} applications found</p>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {app.restaurantName}
                    </h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[app.status]}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Applied: {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Owner Name</p>
                    <p className="font-medium">{app.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{app.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{app.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cuisine</p>
                    <p className="font-medium">{app.cuisine}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">License Number</p>
                    <p className="font-medium">{app.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User</p>
                    <p className="font-medium">{app.userId?.name}</p>
                    <p className="text-sm text-gray-500">{app.userId?.email}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{app.address}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-700">{app.description}</p>
                </div>

                {app.adminNotes && (
                  <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Admin Notes:</p>
                    <p className="text-gray-700">{app.adminNotes}</p>
                  </div>
                )}

                {app.status === "pending" && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => openModal(app._id, "approve")}
                      disabled={processing === app._id}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {processing === app._id ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => openModal(app._id, "reject")}
                      disabled={processing === app._id}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Notes Modal */}
        {notesModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                {notesModal.action === "approve" ? "Approve" : "Reject"}{" "}
                Application
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {notesModal.action === "approve"
                  ? "Adding a note is optional but recommended."
                  : "Please provide a reason for rejection."}
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  notesModal.action === "approve"
                    ? "Optional notes..."
                    : "Reason for rejection..."
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  onClick={
                    notesModal.action === "approve"
                      ? handleApprove
                      : handleReject
                  }
                  disabled={processing}
                  className={`flex-1 px-4 py-2 rounded-lg text-white ${
                    notesModal.action === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  } disabled:opacity-50`}
                >
                  {notesModal.action === "approve"
                    ? "Confirm Approval"
                    : "Confirm Rejection"}
                </button>
                <button
                  onClick={() =>
                    setNotesModal({
                      open: false,
                      applicationId: null,
                      action: "",
                    })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRestaurantApplications;
