import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLoyaltyInfo,
  fetchLoyaltyTransactions,
  fetchLoyaltyAchievements,
  generateReferralCode,
  selectLoyalty,
  selectLoyaltyTransactions,
  selectLoyaltyLoading,
} from "../../store/slices/userSlice";

const Loyalty = () => {
  const dispatch = useDispatch();
  const loyalty = useSelector(selectLoyalty);
  const transactions = useSelector(selectLoyaltyTransactions);
  const loading = useSelector(selectLoyaltyLoading);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    dispatch(fetchLoyaltyInfo());
    dispatch(fetchLoyaltyTransactions());
    dispatch(fetchLoyaltyAchievements());
  }, [dispatch]);

  const handleGenerateReferral = () => {
    dispatch(generateReferralCode());
  };

  // Get tier badge color
  const getTierColor = (tier) => {
    const colors = {
      Bronze: {
        bg: "from-amber-700 to-amber-900",
        text: "text-amber-700",
        border: "border-amber-700",
      },
      Silver: {
        bg: "from-gray-400 to-gray-600",
        text: "text-gray-600",
        border: "border-gray-500",
      },
      Gold: {
        bg: "from-yellow-400 to-yellow-600",
        text: "text-yellow-600",
        border: "border-yellow-500",
      },
      Platinum: {
        bg: "from-purple-400 to-purple-600",
        text: "text-purple-600",
        border: "border-purple-500",
      },
      Diamond: {
        bg: "from-cyan-400 to-blue-500",
        text: "text-blue-600",
        border: "border-blue-500",
      },
    };
    return colors[tier] || colors.Bronze;
  };

  const tierColors = getTierColor(loyalty.loyaltyTier || "Bronze");

  // Points breakdown
  const pointsBreakdown = [
    {
      action: "Welcome Bonus",
      points: 50,
      achieved: loyalty.loyaltyPoints >= 50,
    },
    {
      action: "First Reservation",
      points: 100,
      achieved: loyalty.achievements?.firstReservation,
    },
    {
      action: "Per Reservation",
      points: 25,
      achieved: loyalty.totalReservations > 0,
    },
    {
      action: "3-Month Streak",
      points: 100,
      achieved: loyalty.achievements?.threeMonthStreak,
    },
    { action: "Referral", points: 50, achieved: false },
    {
      action: "5 Reservations",
      points: 50,
      achieved: loyalty.achievements?.milestone5,
    },
    {
      action: "10 Reservations",
      points: 75,
      achieved: loyalty.achievements?.milestone10,
    },
    {
      action: "25 Reservations",
      points: 100,
      achieved: loyalty.achievements?.milestone25,
    },
    {
      action: "50 Reservations",
      points: 165,
      achieved: loyalty.achievements?.milestone50,
    },
    {
      action: "First Year Monthly",
      points: 200,
      achieved: loyalty.achievements?.firstYearMonthly,
    },
  ];

  // Calculate progress to next tier
  const tierThresholds = {
    Bronze: { min: 0, max: 199, next: "Silver", nextMin: 200 },
    Silver: { min: 200, max: 399, next: "Gold", nextMin: 400 },
    Gold: { min: 400, max: 599, next: "Platinum", nextMin: 600 },
    Platinum: { min: 600, max: 799, next: "Diamond", nextMin: 800 },
    Diamond: { min: 800, max: 1000, next: null, nextMin: 1000 },
  };

  const currentTier =
    tierThresholds[loyalty.loyaltyTier] || tierThresholds.Bronze;
  const progressPercent = currentTier.next
    ? ((loyalty.loyaltyPoints - currentTier.min) /
        (currentTier.nextMin - currentTier.min)) *
      100
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Loyalty Program
              </h1>
              <p className="text-indigo-100">
                Earn points and unlock exclusive rewards!
              </p>
            </div>
            <div className="text-center">
              <div
                className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r ${tierColors.bg} shadow-lg mb-2`}
              >
                <span className="text-4xl font-bold">
                  {loyalty.loyaltyPoints || 0}
                </span>
              </div>
              <p className={`font-bold text-lg ${tierColors.text}`}>
                {loyalty.loyaltyTier || "Bronze"} Member
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {currentTier.next && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>{currentTier.min} pts</span>
                <span className="font-medium">
                  {currentTier.next} at {currentTier.nextMin} pts
                </span>
                <span>{currentTier.max} pts</span>
              </div>
              <div className="bg-white/20 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                />
              </div>
              <p className="text-center text-indigo-100 text-sm mt-2">
                {currentTier.nextMin - loyalty.loyaltyPoints} points to{" "}
                {currentTier.next}
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-500">
            <p className="text-slate-500 text-sm">Total Points</p>
            <p className="text-2xl font-bold text-slate-800">
              {loyalty.loyaltyPoints || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-indigo-500">
            <p className="text-slate-500 text-sm">Total Reservations</p>
            <p className="text-2xl font-bold text-slate-800">
              {loyalty.totalReservations || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-emerald-500">
            <p className="text-slate-500 text-sm">Current Streak</p>
            <p className="text-2xl font-bold text-slate-800">
              {loyalty.streakData?.currentStreak || 0} months
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
            <p className="text-slate-500 text-sm">Member Since</p>
            <p className="text-2xl font-bold text-slate-800">
              {loyalty.memberSince
                ? new Date(loyalty.memberSince).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["overview", "achievements", "history", "referral"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                How to Earn Points
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {pointsBreakdown.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      item.achieved
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-2xl ${item.achieved ? "" : "opacity-50"}`}
                      >
                        {item.achieved ? "✅" : "⭕"}
                      </span>
                      <span
                        className={`font-medium ${item.achieved ? "text-slate-800" : "text-slate-500"}`}
                      >
                        {item.action}
                      </span>
                    </div>
                    <span
                      className={`font-bold ${item.achieved ? "text-emerald-600" : "text-slate-400"}`}
                    >
                      +{item.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Your Achievements
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    id: "firstReservation",
                    name: "First Reservation",
                    desc: "Complete your first booking",
                    icon: "🎉",
                  },
                  {
                    id: "milestone5",
                    name: "5 Reservations",
                    desc: "Complete 5 reservations",
                    icon: "⭐",
                  },
                  {
                    id: "milestone10",
                    name: "10 Reservations",
                    desc: "Complete 10 reservations",
                    icon: "🌟",
                  },
                  {
                    id: "milestone25",
                    name: "25 Reservations",
                    desc: "Complete 25 reservations",
                    icon: "🏆",
                  },
                  {
                    id: "milestone50",
                    name: "50 Reservations",
                    desc: "Complete 50 reservations",
                    icon: "👑",
                  },
                  {
                    id: "threeMonthStreak",
                    name: "3-Month Streak",
                    desc: "Order each month for 3 months",
                    icon: "🔥",
                  },
                  {
                    id: "firstYearCompleted",
                    name: "First Year",
                    desc: "Member for 1 year",
                    icon: "🎂",
                  },
                  {
                    id: "firstYearMonthly",
                    name: "Monthly Regular",
                    desc: "Order each month in first year",
                    icon: "📅",
                  },
                ].map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-6 rounded-xl border-2 text-center transition-all ${
                      loyalty.achievements?.[achievement.id]
                        ? "border-amber-500 bg-amber-50"
                        : "border-slate-200 bg-slate-50 opacity-60"
                    }`}
                  >
                    <span className="text-4xl block mb-2">
                      {achievement.icon}
                    </span>
                    <h3 className="font-bold text-slate-800">
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-slate-500">{achievement.desc}</p>
                    {loyalty.achievements?.[achievement.id] && (
                      <span className="inline-block mt-2 px-3 py-1 bg-emerald-500 text-white text-xs rounded-full">
                        Unlocked!
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Points History
              </h2>
              {transactions && transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.map((tx, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-slate-800">
                          {tx.description}
                        </p>
                        <p className="text-sm text-slate-500">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-emerald-600 font-bold">
                        +{tx.points}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">
                  No transactions yet. Start booking to earn points!
                </p>
              )}
            </div>
          )}

          {/* Referral Tab */}
          {activeTab === "referral" && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Refer Friends
              </h2>
              <div className="text-center py-8">
                <div className="mb-6">
                  <span className="text-6xl">🎁</span>
                </div>
                <p className="text-slate-600 mb-4">
                  Invite your friends and earn <strong>50 bonus points</strong>{" "}
                  for each referral!
                </p>
                {loyalty.referralCode ? (
                  <div className="bg-slate-100 p-4 rounded-xl inline-block">
                    <p className="text-sm text-slate-500 mb-2">
                      Your Referral Code
                    </p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {loyalty.referralCode}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateReferral}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Generate Referral Code
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Loyalty;
