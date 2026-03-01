import express from 'express';
import { getRestaurantAnalytics, getComparisonAnalytics, getAdminAnalytics } from '../controllers/analyticsController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get restaurant analytics (for restaurant owners)
router.get('/', auth, getRestaurantAnalytics);

// Get comparison analytics
router.get('/comparison', auth, getComparisonAnalytics);

// Get admin/platform analytics (for super_admin)
router.get('/admin', auth, getAdminAnalytics);

export default router;
