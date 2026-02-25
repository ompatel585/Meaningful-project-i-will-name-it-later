export const API_ENDPOINTS = {
    // Auth
    AUTH_LOGIN: '/auth/login',
    AUTH_REGISTER: '/auth/register',
    AUTH_ME: '/auth/me',

    // Restaurants
    RESTAURANTS: '/restaurants',
    RESTAURANT_BY_ID: (id) => `/restaurants/${id}`,
    MY_RESTAURANT: '/restaurants/manager/my-restaurant',

    // Reservations
    RESERVATIONS: '/reservations',
    RESERVATION_BY_ID: (id) => `/reservations/${id}`,
    RESERVATION_STATUS: (id) => `/reservations/${id}/status`,
    RESERVATION_CANCEL: (id) => `/reservations/${id}/cancel`,

    // Reviews
    REVIEWS: '/reviews',
    REVIEWS_RESTAURANT: (id) => `/reviews/restaurant/${id}`,
    REVIEWS_OWNER: '/reviews/owner/my-restaurant-reviews',
    REVIEW_BY_ID: (id) => `/reviews/${id}`,
    REVIEW_RESPOND: (id) => `/reviews/${id}/respond`,

    // Applications
    APPLICATIONS_APPLY: '/applications/apply-restaurant',
    APPLICATIONS_MY: '/applications/my-application',
    APPLICATIONS_ADMIN: '/applications/admin/restaurant-applications',
    APPLICATION_ADMIN_BY_ID: (id) => `/applications/admin/restaurant-applications/${id}`,
    APPLICATION_APPROVE: (id) => `/applications/admin/restaurant-applications/${id}/approve`,
    APPLICATION_REJECT: (id) => `/applications/admin/restaurant-applications/${id}/reject`,

    // Users (Admin)
    USERS: '/users',
    USER_BY_ID: (id) => `/users/${id}`,
    USER_TOGGLE_ACTIVE: (id) => `/users/${id}/toggle-active`,
};

export const APP_ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    RESTAURANTS: '/restaurants',
    RESTAURANT_DETAIL: (id) => `/restaurants/${id}`,
    MY_RESERVATIONS: '/my-reservations',
    MANAGE_RESTAURANT: '/manage-restaurant',
    MANAGE_REVIEWS: '/manage-reviews',
    APPLY_RESTAURANT: '/apply-restaurant',
    ADMIN_USERS: '/admin/users',
    ADMIN_APPLICATIONS: '/admin/applications',
};

export const RESERVATION_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};

export const APPLICATION_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
};

export const USER_ROLES = {
    SUPER_ADMIN: 'super_admin',
    RESTAURANT_OWNER: 'restaurant_owner',
    USER: 'user',
};

export const CUISINES = [
    'American',
    'Italian',
    'Chinese',
    'Japanese',
    'Indian',
    'Mexican',
    'Thai',
    'French',
    'Mediterranean',
    'Korean',
    'Vietnamese',
    'Greek',
    'Spanish',
    'Middle Eastern',
    'Other',
];

export const DAYS_OF_WEEK = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
];

export const TIME_SLOTS = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
    '22:00', '22:30', '23:00', '23:30',
];

export const PAGINATION_LIMIT = 10;

export const RATING_OPTIONS = [
    { value: 1, label: '1 Star' },
    { value: 2, label: '2 Stars' },
    { value: 3, label: '3 Stars' },
    { value: 4, label: '4 Stars' },
    { value: 5, label: '5 Stars' },
];

export const PARTY_SIZE_OPTIONS = Array.from({ length: 20 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} ${i === 0 ? 'Guest' : 'Guests'}`,
}));

// Crown Circle Loyalty Program Constants
export const LOYALTY_CONFIG = {
    MAX_POINTS: 1000,
    POINTS_PER_BLOCK: 100,

    // Tier Names
    TIERS: {
        ENTRY: 'Silver',
        MID: 'Gold',
        ELITE: 'Platinum',
        INVITE: 'Diamond',
    },

    // Tier Point Thresholds
    TIER_THRESHOLDS: {
        SILVER: { min: 0, max: 299, name: 'Silver' },
        GOLD: { min: 300, max: 599, name: 'Gold' },
        PLATINUM: { min: 600, max: 899, name: 'Platinum' },
        DIAMOND: { min: 900, max: 1000, name: 'Diamond' },
    },

    // Earning Points
    POINTS: {
        SIGNUP_BONUS: 75,
        FIRST_RESERVATION: 150,
        REFERRAL_BONUS: 200,
        PREMIUM_RESTAURANT_BONUS: 50,
        OFF_PEAK_BONUS: 30,
        SPECIAL_EVENT_BONUS: 75,
        PER_RUPEE_SPENT: 1, // 1 point per ₹100 spent
    },

    // Tier Benefits by Name
    TIER_BENEFITS: {
        Silver: [
            'Complimentary welcome drink',
            'Priority reservation access',
            'Birthday dining privileges',
        ],
        Gold: [
            'Everything in Silver',
            "Chef's special tasting access",
            'Early access to events',
            '10% off on peak hours',
        ],
        Platinum: [
            'Everything in Gold',
            'Exclusive event invites',
            'Concierge booking support',
            'Complimentary appetizer monthly',
            '20% off on all bookings',
        ],
        Diamond: [
            'Everything in Platinum',
            'Private dining access',
            "Exclusive chef's table experience",
            'Invite-only events',
            'Annual VIP membership',
            'Complimentary champagne on arrival',
        ],
    },

    // 1000 Point Reward
    ELITE_REWARD: 'Lifetime Diamond Membership + Private Chef Experience',

    // Point Earning Descriptions
    EARNING_ACTIONS: [
        { action: 'Account Signup', points: 75, description: 'Welcome bonus' },
        { action: 'First Reservation', points: 150, description: 'Complete your first booking' },
        { action: 'Per ₹100 Spent', points: 1, description: 'On dining bill' },
        { action: 'Refer a Friend', points: 200, description: 'After friend completes first reservation' },
        { action: 'Premium Restaurant', points: 50, description: 'Dining at partner premium venues' },
        { action: 'Off-Peak Booking', points: 30, description: 'Booking during off-peak hours' },
        { action: 'Special Event', points: 75, description: 'Booking special event experiences' },
    ],
};

// Helper function to get tier from points
export const getTierFromPoints = (points) => {
    if (points >= LOYALTY_CONFIG.TIER_THRESHOLDS.DIAMOND.min) {
        return { ...LOYALTY_CONFIG.TIER_THRESHOLDS.DIAMOND, level: 4 };
    }
    if (points >= LOYALTY_CONFIG.TIER_THRESHOLDS.PLATINUM.min) {
        return { ...LOYALTY_CONFIG.TIER_THRESHOLDS.PLATINUM, level: 3 };
    }
    if (points >= LOYALTY_CONFIG.TIER_THRESHOLDS.GOLD.min) {
        return { ...LOYALTY_CONFIG.TIER_THRESHOLDS.GOLD, level: 2 };
    }
    return { ...LOYALTY_CONFIG.TIER_THRESHOLDS.SILVER, level: 1 };
};

// Helper function to calculate progress to next tier
export const getProgressToNextTier = (points) => {
    const tier = getTierFromPoints(points);
    if (tier.name === 'Diamond') {
        return { current: 100, next: null, remaining: 0 };
    }
    const nextTierMin = tier.level === 1 ? 300 : tier.level === 2 ? 600 : 900;
    const remaining = nextTierMin - points;
    const current = ((points - tier.min) / (tier.max - tier.min + 1)) * 100;
    return {
        current: Math.round(current),
        next: nextTierMin,
        remaining,
        nextTierName: tier.level === 1 ? 'Gold' : tier.level === 2 ? 'Platinum' : 'Diamond'
    };
};
