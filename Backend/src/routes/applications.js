import express from 'express';
import {
    applyRestaurant,
    getMyApplication,
    getAllApplications,
    approveApplication,
    rejectApplication
} from '../controllers/applicationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/apply-restaurant', authenticate, applyRestaurant);
router.get('/my-application', authenticate, getMyApplication);
router.get('/admin/restaurant-applications', authenticate, authorize('super_admin'), getAllApplications);
router.put('/admin/restaurant-applications/:id/approve', authenticate, authorize('super_admin'), approveApplication);
router.put('/admin/restaurant-applications/:id/reject', authenticate, authorize('super_admin'), rejectApplication);

export default router;
