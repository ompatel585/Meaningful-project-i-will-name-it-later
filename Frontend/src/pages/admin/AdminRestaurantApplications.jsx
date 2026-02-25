import { useState, useEffect } from "react";
import { applicationAPI } from "../../api";

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
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Restaurant Applications
          </h1>
          <p className="text-slate-500 text-lg">
            Review and manage partner applications
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-xl font-semibold capitalize transition-all duration-300 ${
                filter === status
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-white text-slate-600 hover:bg-slate-100 shadow-md"
              }`}
            >
              {status}
              {status === "pending" && (
                <span className="ml-2 px-2 py-0.5 bg-amber-400 text-amber-900 text-xs rounded-full">
                  {applications.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {applications.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-slate-500 text-lg">
                No {filter} applications found
              </p>
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-2xl font-bold text-slate-800">
                        {app.restaurantName}
                      </h3>
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border ${statusColors[app.status]}`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-slate-500">
                      Applied:{" "}
                      {new Date(app.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {app.status === "pending" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => openModal(app._id, "approve")}
                        disabled={processing === app._id}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 disabled:opacity-50"
                      >
                        {processing === app._id ? "Processing..." : "Approve"}
                      </button>
                      <button
                        onClick={() => openModal(app._id, "reject")}
                        disabled={processing === app._id}
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 hover:-translate-y-1 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Owner</p>
                    <p className="font-semibold text-slate-800">
                      {app.ownerName}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Phone</p>
                    <p className="font-semibold text-slate-800">{app.phone}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Email</p>
                    <p className="font-semibold text-slate-800 text-sm">
                      {app.email}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Cuisine</p>
                    <p className="font-semibold text-slate-800">
                      {app.cuisine}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">License</p>
                    <p className="font-semibold text-slate-800 text-sm">
                      {app.licenseNumber}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Applicant</p>
                    <p className="font-semibold text-slate-800 text-sm">
                      {app.userId?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {app.userId?.email}
                    </p>
                  </div>
                </div>

                {/* Address & Description */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Address</p>
                    <p className="font-medium text-slate-700">{app.address}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Description</p>
                    <p className="text-slate-700">{app.description}</p>
                  </div>
                </div>

                {/* Admin Notes */}
                {app.adminNotes && (
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <p className="text-xs text-indigo-500 font-medium mb-1">
                      Admin Notes:
                    </p>
                    <p className="text-indigo-700">{app.adminNotes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Notes Modal */}
        {notesModal.open && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                {notesModal.action === "approve" ? "Approve" : "Reject"}{" "}
                Application
              </h3>
              <p className="text-slate-500 mb-6">
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
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 mb-6"
                rows={4}
              />
              <div className="flex gap-3">
                <button
                  onClick={
                    notesModal.action === "approve"
                      ? handleApprove
                      : handleReject
                  }
                  disabled={processing}
                  className={`flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 disabled:opacity-50 ${
                    notesModal.action === "approve"
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30"
                      : "bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg hover:shadow-red-500/30"
                  }`}
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
                  className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
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
