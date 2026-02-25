import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LOYALTY_CONFIG,
  getTierFromPoints,
  getProgressToNextTier,
} from "../../utils/constants";

// Mock user data - in production this would come from context/API
const mockUserLoyalty = {
  points: 425,
  tier: "Gold",
  memberSince: "January 2024",
  totalReservations: 12,
  referralCount: 3,
  nextRewardPoints: 100,
};

const CrownCircle = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const userPoints = mockUserLoyalty.points;
  const tier = getTierFromPoints(userPoints);
  const progress = getProgressToNextTier(userPoints);

  // Generate 10x10 grid blocks
  const generatePointsGrid = () => {
    const blocks = [];
    const filledBlocks = Math.floor(
      userPoints / LOYALTY_CONFIG.POINTS_PER_BLOCK,
    );
    const partialFill =
      ((userPoints % LOYALTY_CONFIG.POINTS_PER_BLOCK) /
        LOYALTY_CONFIG.POINTS_PER_BLOCK) *
      100;

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const blockIndex = i * 10 + j;
        const isFilled = blockIndex < filledBlocks;
        const isPartial = blockIndex === filledBlocks && partialFill > 0;

        blocks.push(
          <div
            key={`${i}-${j}`}
            className={`w-full aspect-square rounded-sm ${
              isFilled
                ? "bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg shadow-amber-500/30"
                : isPartial
                  ? `bg-gradient-to-br from-amber-400/30 to-yellow-500/30`
                  : "bg-slate-800/50 border border-slate-700"
            }`}
            style={
              isPartial
                ? {
                    background: `linear-gradient(to bottom, #f59e0b ${partialFill}%, #1e293b ${partialFill}%)`,
                  }
                : {}
            }
          />,
        );
      }
    }
    return blocks;
  };

  const getTierColor = (tierName) => {
    switch (tierName) {
      case "Silver":
        return "from-slate-400 to-slate-300";
      case "Gold":
        return "from-amber-400 to-yellow-500";
      case "Platinum":
        return "from-gray-300 to-gray-400";
      case "Diamond":
        return "from-cyan-400 to-blue-500";
      default:
        return "from-slate-400 to-slate-300";
    }
  };

  const getTierBadgeStyle = (tierName) => {
    switch (tierName) {
      case "Silver":
        return "bg-gradient-to-br from-slate-400 to-slate-300 text-slate-900";
      case "Gold":
        return "bg-gradient-to-br from-amber-400 to-yellow-500 text-amber-900";
      case "Platinum":
        return "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900";
      case "Diamond":
        return "bg-gradient-to-br from-cyan-400 to-blue-500 text-white";
      default:
        return "bg-gradient-to-br from-slate-400 to-slate-300 text-slate-900";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-40 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 -right-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
          <div className="absolute -bottom-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center">
            {/* Crown Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/30 transform rotate-12">
                  <svg
                    className="w-12 h-12 text-slate-900 -rotate-12"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-full animate-ping"></div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent mb-4">
              CROWN CIRCLE
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
              Your gateway to exclusive dining experiences. Ascend through elite
              tiers and unlock extraordinary privileges.
            </p>

            {/* Current Tier Badge */}
            <div className="inline-flex items-center gap-3">
              <span className="text-slate-500 uppercase tracking-widest text-sm">
                Your Status
              </span>
              <div
                className={`px-6 py-2 rounded-full font-bold text-lg shadow-lg ${getTierBadgeStyle(tier.name)}`}
              >
                {tier.name.toUpperCase()} MEMBER
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 -mt-8">
          <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border border-amber-500/20 shadow-xl">
            <div className="text-amber-400 mb-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm">Crown Points</p>
            <p className="text-3xl font-bold text-white">{userPoints}</p>
            <p className="text-slate-500 text-xs">
              of {LOYALTY_CONFIG.MAX_POINTS} max
            </p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 shadow-xl">
            <div className="text-slate-400 mb-2">
              <svg
                className="w-6 h-6"
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
            </div>
            <p className="text-slate-400 text-sm">Reservations</p>
            <p className="text-3xl font-bold text-white">
              {mockUserLoyalty.totalReservations}
            </p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 shadow-xl">
            <div className="text-slate-400 mb-2">
              <svg
                className="w-6 h-6"
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
            </div>
            <p className="text-slate-400 text-sm">Referrals</p>
            <p className="text-3xl font-bold text-white">
              {mockUserLoyalty.referralCount}
            </p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 shadow-xl">
            <div className="text-slate-400 mb-2">
              <svg
                className="w-6 h-6"
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
            </div>
            <p className="text-slate-400 text-sm">Member Since</p>
            <p className="text-3xl font-bold text-white">
              {mockUserLoyalty.memberSince}
            </p>
          </div>
        </div>

        {/* Points Progress Grid */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 border border-slate-700 mb-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Points Grid */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full"></span>
                Points Journey
              </h2>
              <div className="grid grid-cols-10 gap-1 max-w-md mx-auto md:mx-0">
                {generatePointsGrid()}
              </div>
              <div className="flex justify-between mt-4 text-sm">
                <span className="text-slate-500">0</span>
                <span className="text-amber-400 font-bold">
                  {userPoints} pts
                </span>
                <span className="text-slate-500">1000</span>
              </div>
            </div>

            {/* Right: Tier Progress */}
            <div className="md:w-80">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full"></span>
                Tier Progress
              </h2>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">{tier.name}</span>
                  {progress.nextTierName && (
                    <span className="text-amber-400">
                      {progress.nextTierName}
                    </span>
                  )}
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getTierColor(tier.name)} transition-all duration-1000`}
                    style={{
                      width: `${(userPoints / LOYALTY_CONFIG.MAX_POINTS) * 100}%`,
                    }}
                  ></div>
                </div>
                {progress.nextTierName ? (
                  <p className="text-slate-500 text-sm mt-2">
                    {progress.remaining} more points to unlock{" "}
                    {progress.nextTierName}
                  </p>
                ) : (
                  <p className="text-amber-400 text-sm mt-2 font-semibold">
                    🎉 You've reached the highest tier!
                  </p>
                )}
              </div>

              {/* Tier Indicators */}
              <div className="space-y-3">
                {[
                  {
                    name: "Silver",
                    range: "0-299",
                    current: tier.name === "Silver",
                  },
                  {
                    name: "Gold",
                    range: "300-599",
                    current: tier.name === "Gold",
                  },
                  {
                    name: "Platinum",
                    range: "600-899",
                    current: tier.name === "Platinum",
                  },
                  {
                    name: "Diamond",
                    range: "900-1000",
                    current: tier.name === "Diamond",
                  },
                ].map((t) => (
                  <div
                    key={t.name}
                    className={`flex items-center justify-between p-3 rounded-xl border ${
                      t.current
                        ? "bg-amber-500/10 border-amber-500/50"
                        : "bg-slate-800/50 border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full bg-gradient-to-br ${getTierColor(t.name)}`}
                      ></div>
                      <span
                        className={
                          t.current
                            ? "text-amber-400 font-semibold"
                            : "text-slate-400"
                        }
                      >
                        {t.name}
                      </span>
                    </div>
                    <span className="text-slate-500 text-sm">{t.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {["overview", "earn", "rewards"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold capitalize transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-lg shadow-amber-500/30"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Current Benefits */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-3 h-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full"></span>
                Your {tier.name} Benefits
              </h3>
              <ul className="space-y-4">
                {LOYALTY_CONFIG.TIER_BENEFITS[tier.name].map((benefit, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-slate-300"
                  >
                    <svg
                      className="w-5 h-5 text-amber-400 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Upcoming Benefits */}
            <div className="bg-slate-800/50 rounded-3xl p-8 border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Next Tier Benefits
              </h3>
              {progress.nextTierName ? (
                <ul className="space-y-4">
                  {LOYALTY_CONFIG.TIER_BENEFITS[progress.nextTierName]
                    .filter(
                      (b) =>
                        !LOYALTY_CONFIG.TIER_BENEFITS[tier.name].includes(b),
                    )
                    .map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-slate-500"
                      >
                        <svg
                          className="w-5 h-5 text-slate-600 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="blur-[2px] select-none">
                          {benefit}
                        </span>
                      </li>
                    ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-slate-900"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-amber-400 mb-2">
                    Crown Achieved!
                  </h4>
                  <p className="text-slate-400">
                    You've unlocked all tier benefits. Reach 1000 points for the
                    ultimate reward!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "earn" && (
          <div className="bg-slate-800/50 rounded-3xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-3 h-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full"></span>
              Ways to Earn Points
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {LOYALTY_CONFIG.EARNING_ACTIONS.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700 hover:border-amber-500/50 transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-white font-semibold">{item.action}</h4>
                    <span className="text-amber-400 font-bold">
                      +{item.points} pts
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "rewards" && (
          <div className="space-y-8">
            {/* Available Rewards */}
            <div className="bg-slate-800/50 rounded-3xl p-8 border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-3 h-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full"></span>
                Your Available Rewards
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Welcome Drink",
                    desc: "Complimentary drink on arrival",
                    icon: "🍹",
                  },
                  {
                    name: "Priority Booking",
                    desc: "48-hour advance booking access",
                    icon: "📅",
                  },
                  {
                    name: "Birthday Treat",
                    desc: "Special birthday dining experience",
                    icon: "🎂",
                  },
                ].map((reward, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-2xl p-6 border border-amber-500/30"
                  >
                    <div className="text-4xl mb-3">{reward.icon}</div>
                    <h4 className="text-amber-400 font-bold mb-2">
                      {reward.name}
                    </h4>
                    <p className="text-slate-400 text-sm">{reward.desc}</p>
                    <button className="mt-4 w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-semibold rounded-lg hover:from-amber-400 hover:to-yellow-400 transition-all">
                      Claim
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Locked Rewards */}
            <div className="bg-slate-900/50 rounded-3xl p-8 border border-slate-800">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Locked Rewards
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Chef's Table",
                    desc: "Exclusive chef's table experience",
                    tier: "Gold",
                    icon: "👨‍🍳",
                  },
                  {
                    name: "Private Dining",
                    desc: "Intimate private dining room",
                    tier: "Platinum",
                    icon: "🚪",
                  },
                  {
                    name: "VIP Membership",
                    desc: "Annual VIP membership + perks",
                    tier: "Diamond",
                    icon: "👑",
                  },
                ].map((reward, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-2xl p-6 border border-slate-700 bg-slate-800/30 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
                    <div className="relative text-center">
                      <div className="text-4xl mb-3 opacity-50">
                        {reward.icon}
                      </div>
                      <h4 className="text-slate-400 font-bold mb-2 blur-[1px]">
                        {reward.name}
                      </h4>
                      <p className="text-slate-500 text-sm blur-[1px]">
                        {reward.desc}
                      </p>
                      <div className="mt-4 inline-block px-4 py-1 bg-slate-700 rounded-full text-xs text-slate-400">
                        Unlock at {reward.tier}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ultimate Reward */}
            <div className="relative bg-gradient-to-r from-amber-900/30 via-yellow-900/20 to-amber-900/30 rounded-3xl p-8 border border-amber-500/30 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full filter blur-3xl"></div>
              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full mb-6 shadow-lg shadow-amber-500/30">
                  <svg
                    className="w-10 h-10 text-slate-900"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent mb-4">
                  1000 Points Ultimate Reward
                </h3>
                <p className="text-slate-400 max-w-2xl mx-auto mb-6">
                  Reach the pinnacle of Crown Circle membership. Unlock lifetime
                  Diamond status and an exclusive private chef experience at any
                  of our premium partner restaurants.
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 rounded-full border border-amber-500/30">
                  <span className="text-amber-400 font-bold">
                    {mockUserLoyalty.nextRewardPoints}
                  </span>
                  <span className="text-slate-500">points remaining</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold rounded-2xl hover:from-amber-400 hover:to-yellow-400 transition-all shadow-lg shadow-amber-500/30"
          >
            <span>Start Earning Points</span>
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CrownCircle;
