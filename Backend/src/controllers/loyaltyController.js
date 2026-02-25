import User, { LOYALTY_POINTS, getTierFromPoints } from '../models/User.js';
import LoyaltyTransaction from '../models/LoyaltyTransaction.js';

// Helper function to award points
const awardPoints = async (userId, pointsType, description, relatedId = null, relatedModel = null) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const points = LOYALTY_POINTS[pointsType];
    if (!points) throw new Error('Invalid points type');

    // Update user points
    user.loyaltyPoints += points;
    user.loyaltyTier = getTierFromPoints(user.loyaltyPoints).name;

    // Create transaction record
    await LoyaltyTransaction.create({
        userId: user._id,
        points: points,
        type: pointsType,
        description: description,
        relatedId: relatedId,
        relatedModel: relatedModel,
        balanceAfter: user.loyaltyPoints
    });

    await user.save();
    return { points, newBalance: user.loyaltyPoints, tier: user.loyaltyTier };
};

// Helper function to check and award streak bonus
const checkStreakBonus = async (user) => {
    const now = new Date();
    const lastOrder = user.streakData.lastOrderDate;

    // Initialize monthly orders map if needed
    if (!user.streakData.monthlyOrders) {
        user.streakData.monthlyOrders = {};
    }

    // Get current month key (YYYY-MM)
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Increment monthly order count
    user.streakData.monthlyOrders.set(currentMonthKey, (user.streakData.monthlyOrders.get(currentMonthKey) || 0) + 1);

    // Update last order date
    user.streakData.lastOrderDate = now;

    // Check for 3-month streak (current month + previous 2 months)
    let streakCount = 0;
    for (let i = 0; i < 3; i++) {
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1 - i).padStart(2, '0')}`;
        // Handle year rollover
        let adjustedYear = now.getFullYear();
        let adjustedMonth = now.getMonth() + 1 - i;
        if (adjustedMonth <= 0) {
            adjustedMonth += 12;
            adjustedYear -= 1;
        }
        const adjustedKey = `${adjustedYear}-${String(adjustedMonth).padStart(2, '0')}`;

        if (user.streakData.monthlyOrders.get(adjustedKey) && user.streakData.monthlyOrders.get(adjustedKey) > 0) {
            streakCount++;
        } else {
            break;
        }
    }

    // Award streak bonus if 3 consecutive months
    let streakBonusAwarded = false;
    if (streakCount >= 3 && !user.achievements.threeMonthStreak) {
        // Check if last streak bonus was more than 3 months ago
        if (!user.streakData.lastStreakBonus ||
            (now - user.streakData.lastStreakBonus) > 90 * 24 * 60 * 60 * 1000) {
            user.streakData.currentStreak = streakCount;
            user.achievements.threeMonthStreak = true;
            user.streakData.lastStreakBonus = now;
            streakBonusAwarded = true;
        }
    }

    // Update first year monthly orders
    const memberDays = (now - user.memberSince) / (1000 * 60 * 60 * 24);
    if (memberDays <= 365) {
        user.firstYearMonthlyOrders = (user.firstYearMonthlyOrders || 0) + 1;

        // Check for first year monthly achievement (12 months with orders)
        if (user.firstYearMonthlyOrders >= 12 && !user.achievements.firstYearMonthly) {
            user.achievements.firstYearMonthly = true;
        }
    }

    await user.save();
    return streakBonusAwarded;
};

// Helper function to check and award milestone bonuses
const checkMilestones = async (user) => {
    const milestones = [];
    const totalReservations = user.totalReservations;

    if (totalReservations >= 5 && !user.achievements.milestone5) {
        user.achievements.milestone5 = true;
        milestones.push('MILESTONE_5');
    }
    if (totalReservations >= 10 && !user.achievements.milestone10) {
        user.achievements.milestone10 = true;
        milestones.push('MILESTONE_10');
    }
    if (totalReservations >= 25 && !user.achievements.milestone25) {
        user.achievements.milestone25 = true;
        milestones.push('MILESTONE_25');
    }
    if (totalReservations >= 50 && !user.achievements.milestone50) {
        user.achievements.milestone50 = true;
        milestones.push('MILESTONE_50');
    }

    // Check first year completed
    if (user.memberSince) {
        const memberDays = (new Date() - user.memberSince) / (1000 * 60 * 60 * 24);
        if (memberDays >= 365 && !user.achievements.firstYearCompleted) {
            user.achievements.firstYearCompleted = true;
            milestones.push('FIRST_YEAR_COMPLETED');
        }
    }

    if (milestones.length > 0) {
        await user.save();
    }

    return milestones;
};

// GET /api/loyalty - Get user's loyalty info
export const getLoyaltyInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate next tier progress
        const currentTier = getTierFromPoints(user.loyaltyPoints);
        const nextTierNames = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
        const currentTierIndex = nextTierNames.indexOf(user.loyaltyTier);
        const nextTier = currentTierIndex < 4 ? nextTierNames[currentTierIndex + 1] : null;
        const pointsToNextTier = nextTier ? nextTier - user.loyaltyPoints : 0;

        res.json({
            loyaltyPoints: user.loyaltyPoints,
            loyaltyTier: user.loyaltyTier,
            tierColor: currentTier.color,
            totalReservations: user.totalReservations,
            streakData: user.streakData,
            achievements: user.achievements,
            nextTier: nextTier,
            pointsToNextTier: pointsToNextTier,
            memberSince: user.memberSince,
            referralCode: user.referralCode
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/loyalty/transactions - Get loyalty transaction history
export const getLoyaltyTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const transactions = await LoyaltyTransaction.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await LoyaltyTransaction.countDocuments({ userId: req.user._id });

        res.json({
            transactions,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/loyalty/achievements - Get achievements
export const getAchievements = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get all possible achievements with status
        const allAchievements = [
            { id: 'firstReservation', name: 'First Reservation', description: 'Complete your first reservation', points: LOYALTY_POINTS.FIRST_RESERVATION, achieved: user.achievements.firstReservation },
            { id: 'profileCompleted', name: 'Profile Complete', description: 'Add phone and avatar to your profile', points: LOYALTY_POINTS.PROFILE_COMPLETION, achieved: user.achievements.profileCompleted },
            { id: 'firstReview', name: 'First Review', description: 'Write your first restaurant review', points: LOYALTY_POINTS.FIRST_REVIEW, achieved: user.achievements.firstReview },
            { id: 'milestone5', name: '5 Reservations', description: 'Complete 5 reservations', points: LOYALTY_POINTS.MILESTONE_5, achieved: user.achievements.milestone5 },
            { id: 'milestone10', name: '10 Reservations', description: 'Complete 10 reservations', points: LOYALTY_POINTS.MILESTONE_10, achieved: user.achievements.milestone10 },
            { id: 'milestone25', name: '25 Reservations', description: 'Complete 25 reservations', points: LOYALTY_POINTS.MILESTONE_25, achieved: user.achievements.milestone25 },
            { id: 'milestone50', name: '50 Reservations', description: 'Complete 50 reservations', points: LOYALTY_POINTS.MILESTONE_50, achieved: user.achievements.milestone50 },
            { id: 'threeMonthStreak', name: '3-Month Streak', description: 'Order at least once per month for 3 consecutive months', points: LOYALTY_POINTS.THREE_MONTH_STREAK, achieved: user.achievements.threeMonthStreak },
            { id: 'firstYearCompleted', name: 'First Year Member', description: 'Complete 1 year as a member', points: LOYALTY_POINTS.FIRST_YEAR_COMPLETED, achieved: user.achievements.firstYearCompleted },
            { id: 'firstYearMonthly', name: 'Monthly Regular', description: 'Order at least once each month for your first year', points: LOYALTY_POINTS.FIRST_YEAR_MONTHLY, achieved: user.achievements.firstYearMonthly }
        ];

        const achievedCount = allAchievements.filter(a => a.achieved).length;

        res.json({
            achievements: allAchievements,
            achievedCount,
            totalCount: allAchievements.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/loyalty/referral - Use a referral code
export const useReferralCode = async (req, res) => {
    try {
        const { referralCode } = req.body;

        if (!referralCode) {
            return res.status(400).json({ message: 'Referral code is required' });
        }

        const referringUser = await User.findOne({ referralCode });
        if (!referringUser) {
            return res.status(400).json({ message: 'Invalid referral code' });
        }

        const currentUser = await User.findById(req.user._id);

        // Check if user was already referred
        if (currentUser.referredBy) {
            return res.status(400).json({ message: 'You have already used a referral code' });
        }

        // Check if referring themselves
        if (referringUser._id.equals(currentUser._id)) {
            return res.status(400).json({ message: 'You cannot refer yourself' });
        }

        // Update referring user
        referringUser.loyaltyPoints += LOYALTY_POINTS.REFERRAL;
        referringUser.loyaltyTier = getTierFromPoints(referringUser.loyaltyPoints).name;
        if (!referringUser.referredUsers) {
            referringUser.referredUsers = [];
        }
        referringUser.referredUsers.push(currentUser._id);

        // Create transaction for referrer
        await LoyaltyTransaction.create({
            userId: referringUser._id,
            points: LOYALTY_POINTS.REFERRAL,
            type: 'REFERRAL',
            description: 'Referral bonus - friend signed up',
            relatedId: currentUser._id,
            relatedModel: 'User',
            balanceAfter: referringUser.loyaltyPoints
        });

        await referringUser.save();

        // Update current user
        currentUser.referredBy = referringUser._id;
        await currentUser.save();

        res.json({
            message: 'Referral code applied successfully!',
            pointsAwarded: LOYALTY_POINTS.REFERRAL
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/loyalty/generate-referral-code - Generate referral code
export const generateReferralCode = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user.referralCode) {
            return res.json({ referralCode: user.referralCode });
        }

        // Generate unique referral code
        const code = `USER${user._id.toString().slice(-6).toUpperCase()}${Date.now().toString().slice(-4)}`;
        user.referralCode = code;
        await user.save();

        res.json({ referralCode: code });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export helper functions for use in other controllers
export { awardPoints, checkStreakBonus, checkMilestones };
