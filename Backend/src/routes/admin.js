import express from 'express';
import {
    getStats,
    getAllUsers,
    getAllRestaurants,
    getAllReservations,
    toggleUserStatus,
    verifyRestaurant,
    toggleFeaturedRestaurant,
    deleteUser,
    deleteRestaurant,
    getAnalytics,
    getUserDetails,
    updateUserRole,
    getPendingRestaurants,
    getReports,
    getCategories
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('super_admin'));

router.get('/stats', getStats);
router.get('/stats/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.get('/users/:id/details', getUserDetails);
router.put('/users/:id/status', toggleUserStatus);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/restaurants', getAllRestaurants);
router.get('/restaurants/pending', getPendingRestaurants);
router.put('/restaurants/:id/verify', verifyRestaurant);
router.put('/restaurants/:id/featured', toggleFeaturedRestaurant);
router.delete('/restaurants/:id', deleteRestaurant);
router.get('/reservations', getAllReservations);
router.get('/reports', getReports);
router.get('/categories', getCategories);

export default router;

