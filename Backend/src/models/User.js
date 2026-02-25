import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Loyalty Points Configuration
export const LOYALTY_POINTS = {
    WELCOME_BONUS: 50,
    FIRST_RESERVATION: 100,
    PER_RESERVATION: 25,
    FIRST_REVIEW: 50,
    ADD_FAVORITE: 10,
    PROFILE_COMPLETION: 25,
    THREE_MONTH_STREAK: 100,
    REFERRAL: 50,
    MILESTONE_5: 50,
    MILESTONE_10: 75,
    MILESTONE_25: 100,
    MILESTONE_50: 165,
    FIRST_YEAR_COMPLETED: 25,
    FIRST_YEAR_MONTHLY: 200
};

// Loyalty Tiers
export const LOYALTY_TIERS = {
    BRONZE: { min: 0, max: 199, name: 'Bronze', color: '#CD7F32' },
    SILVER: { min: 200, max: 399, name: 'Silver', color: '#C0C0C0' },
    GOLD: { min: 400, max: 599, name: 'Gold', color: '#FFD700' },
    PLATINUM: { min: 600, max: 799, name: 'Platinum', color: '#E5E4E2' },
    DIAMOND: { min: 800, max: 1000, name: 'Diamond', color: '#B9F2FF' }
};

// Helper function to get tier based on points
export const getTierFromPoints = (points) => {
    if (points >= LOYALTY_TIERS.DIAMOND.min) return LOYALTY_TIERS.DIAMOND;
    if (points >= LOYALTY_TIERS.PLATINUM.min) return LOYALTY_TIERS.PLATINUM;
    if (points >= LOYALTY_TIERS.GOLD.min) return LOYALTY_TIERS.GOLD;
    if (points >= LOYALTY_TIERS.SILVER.min) return LOYALTY_TIERS.SILVER;
    return LOYALTY_TIERS.BRONZE;
};

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['super_admin', 'restaurant_owner', 'user'],
        default: 'user'
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        default: null
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }],
    notificationPreferences: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        reservationReminder: { type: Boolean, default: true },
        promotionalEmails: { type: Boolean, default: false }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Loyalty Program Fields
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    loyaltyTier: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
        default: 'Bronze'
    },
    totalReservations: {
        type: Number,
        default: 0
    },
    // Streak tracking
    streakData: {
        currentStreak: { type: Number, default: 0 },
        lastOrderDate: { type: Date, default: null },
        monthlyOrders: {
            type: Map,
            of: Number,
            default: {}
        },
        lastStreakBonus: { type: Date, default: null }
    },
    // Achievement tracking
    achievements: {
        firstReservation: { type: Boolean, default: false },
        firstReview: { type: Boolean, default: false },
        profileCompleted: { type: Boolean, default: false },
        milestone5: { type: Boolean, default: false },
        milestone10: { type: Boolean, default: false },
        milestone25: { type: Boolean, default: false },
        milestone50: { type: Boolean, default: false },
        threeMonthStreak: { type: Boolean, default: false },
        firstYearCompleted: { type: Boolean, default: false },
        firstYearMonthly: { type: Boolean, default: false }
    },
    // Referral tracking
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    referralCode: {
        type: String,
        unique: true,
        sparse: true
    },
    referredUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Member since (for first year bonus)
    memberSince: {
        type: Date,
        default: Date.now
    },
    // First year monthly tracking
    firstYearMonthlyOrders: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
