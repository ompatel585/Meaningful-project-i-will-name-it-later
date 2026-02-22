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
