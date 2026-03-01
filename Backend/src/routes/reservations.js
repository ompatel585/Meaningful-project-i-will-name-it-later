import express from 'express';
import {
    getAllReservations,
    createReservation,
    updateReservationStatus,
    updateReservation,
    cancelReservation,
    deleteReservation
} from '../controllers/reservationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getAllReservations);
router.post('/', authenticate, createReservation);
router.put('/:id', authenticate, updateReservation);
router.put('/:id/status', authenticate, authorize('super_admin', 'restaurant_manager'), updateReservationStatus);
router.put('/:id/cancel', authenticate, cancelReservation);
router.delete('/:id', authenticate, authorize('super_admin'), deleteReservation);

export default router;
