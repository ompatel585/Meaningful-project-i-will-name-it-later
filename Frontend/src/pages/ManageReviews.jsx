import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { reviewAPI } from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ManageReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reviews");
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await reviewAPI.getOwnerReviews({ limit: 50 });
      setReviews(response.data.reviews);
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (reviewId) => {
    if (!responseText.trim()) return;

    setSubmitting(true);
    try {
      await reviewAPI.respondToReview(reviewId, responseText);
      await fetchReviews();
      setRespondingTo(null);
      setResponseText("");
    } catch (error) {
      console.error("Failed to respond:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-500";
    if (rating >= 3) return "text-yellow-500";
    return "text-red-500";
  };

  const getRatingStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true;
    if (filter === "responded") return review.response;
    if (filter === "unresponded") return !review.response;
    if (filter === "5") return review.rating === 5;
    if (filter === "4") return review.rating === 4;
    if (filter === "3") return review.rating === 3;
    if (filter === "2") return review.rating === 2;
    if (filter === "1") return review.rating === 1;
    return true;
  });

  const pieData = analytics
    ? [
        { name: "5 Stars", value: analytics.fiveStar || 0, color: "#22c55e" },
        { name: "4 Stars", value: analytics.fourStar || 0, color: "#84cc16" },
        { name: "3 Stars", value: analytics.threeStar || 0, color: "#eab308" },
        { name: "2 Stars", value: analytics.twoStar || 0, color: "#f97316" },
        { name: "1 Star", value: analytics.oneStar || 0, color: "#ef4444" },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Reviews & Analytics
            </h1>
            <p className="text-slate-600 mt-1">
              Manage your restaurant reviews
            </p>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Average Rating</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {analytics?.avgRating?.toFixed(1) || "0.0"}
                </p>
              </div>
              <div className="text-4xl text-yellow-400">
                {getRatingStars(Math.round(analytics?.avgRating || 0))}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-slate-500 text-sm">Total Reviews</p>
            <p className="text-3xl font-bold text-indigo-600">
              {analytics?.totalReviews || 0}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-slate-500 text-sm">5-Star Reviews</p>
            <p className="text-3xl font-bold text-green-500">
              {analytics?.fiveStar || 0}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-slate-500 text-sm">Pending Responses</p>
            <p className="text-3xl font-bold text-amber-500">
              {reviews.filter((r) => !r.response).length}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Rating Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Rating Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Rating Bars */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Rating Breakdown
            </h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = analytics?.[`${rating}Star`] || 0;
                const total = analytics?.totalReviews || 1;
                const percentage = (count / total) * 100;

                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-slate-600 w-8">{rating} ★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-slate-600 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 px-2 font-medium transition-colors ${
                activeTab === "reviews"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              All Reviews
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["all", "5", "4", "3", "2", "1", "responded", "unresponded"].map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === f
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f === "all"
                    ? "All"
                    : f === "responded"
                      ? "Responded"
                      : f === "unresponded"
                        ? "Unresponded"
                        : `${f} ★`}
                </button>
              ),
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <p className="text-center text-slate-500 py-8">
                No reviews found
              </p>
            ) : (
              filteredReviews.map((review) => (
                <div key={review._id} className="border-b pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {review.userId?.name?.charAt(0).toUpperCase() ||
                              "?"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            {review.userId?.name || "Anonymous"}
                          </p>
                          <p className="text-sm text-slate-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mb-2">
                        <span
                          className={`text-lg ${getRatingColor(review.rating)}`}
                        >
                          {getRatingStars(review.rating)}
                        </span>
                      </div>

                      {review.comment && (
                        <p className="text-slate-600 mb-2">{review.comment}</p>
                      )}

                      {/* Owner Response */}
                      {review.response && (
                        <div className="bg-slate-50 rounded-lg p-3 mt-3">
                          <p className="text-sm font-medium text-slate-700 mb-1">
                            Your Response:
                          </p>
                          <p className="text-slate-600 text-sm">
                            {review.response.text}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Responded on{" "}
                            {new Date(
                              review.response.respondedAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {!review.response && (
                      <button
                        onClick={() => setRespondingTo(review._id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                      >
                        Respond
                      </button>
                    )}
                  </div>

                  {/* Response Form */}
                  {respondingTo === review._id && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Write your response..."
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleRespond(review._id)}
                          disabled={submitting || !responseText.trim()}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? "Sending..." : "Send Response"}
                        </button>
                        <button
                          onClick={() => {
                            setRespondingTo(null);
                            setResponseText("");
                          }}
                          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageReviews;
