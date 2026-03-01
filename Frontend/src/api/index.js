import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me')
};

// Restaurant API
export const restaurantAPI = {
    getAll: (params) => api.get('/restaurants', { params }),
    getById: (id) => api.get(`/restaurants/${id}`),
    create: (data) => api.post('/restaurants', data),
    update: (id, data) => api.put(`/restaurants/${id}`, data),
    delete: (id) => api.delete(`/restaurants/${id}`),
    getMyRestaurant: () => api.get('/restaurants/owner/my-restaurant'),
    uploadImages: (formData) => api.post('/restaurants/upload-images', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    deleteImage: (imageUrl) => api.delete('/restaurants/delete-image', { data: { imageUrl } })
};

// Reservation API
export const reservationAPI = {
    getAll: (params) => api.get('/reservations', { params }),
    create: (data) => api.post('/reservations', data),
    update: (id, data) => api.put(`/reservations/${id}`, data),
    updateStatus: (id, data) => api.put(`/reservations/${id}/status`, data),
    cancel: (id) => api.put(`/reservations/${id}/cancel`),
    delete: (id) => api.delete(`/reservations/${id}`)
};

// User API (Admin only)
export const userAPI = {
    getAll: (params) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
    toggleActive: (id) => api.put(`/users/${id}/toggle-active`)
};

// Restaurant Application API
export const applicationAPI = {
    apply: (data) => api.post('/applications/apply-restaurant', data),
    getMyApplication: () => api.get('/applications/my-application'),
    getAllApplications: (params) => api.get('/applications/admin/restaurant-applications', { params }),
    approveApplication: (id, notes) => api.put(`/applications/admin/restaurant-applications/${id}/approve`, { notes }),
    rejectApplication: (id, notes) => api.put(`/applications/admin/restaurant-applications/${id}/reject`, { notes })
};

// Review API
export const reviewAPI = {
    getByRestaurant: (restaurantId, params) => api.get(`/reviews/restaurant/${restaurantId}`, { params }),
    create: (data) => api.post('/reviews', data),
    getOwnerReviews: (params) => api.get('/reviews/owner/my-restaurant-reviews', { params }),
    respondToReview: (reviewId, response) => api.put(`/reviews/${reviewId}/respond`, { response }),
    delete: (reviewId) => api.delete(`/reviews/${reviewId}`)
};

// Loyalty API
export const loyaltyAPI = {
    getInfo: () => api.get('/loyalty'),
    getTransactions: (params) => api.get('/loyalty/transactions', { params }),
    getAchievements: () => api.get('/loyalty/achievements'),
    applyReferral: (referralCode) => api.post('/loyalty/referral', { referralCode }),
    generateReferralCode: () => api.post('/loyalty/generate-referral-code')
};

// Testimonials API
export const testimonialAPI = {
    getAll: () => api.get('/testimonials'),
    getFeatured: () => api.get('/testimonials/featured'),
    create: (data) => api.post('/testimonials', data)
};

export default api;
