import express from 'express';
import Reservation from '../models/Reservation.js';
import Restaurant from '../models/Restaurant.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all reservations (filtered by role)
router.get('/', authenticate, async (req, res) => {
    try {
        let query = {};

        // Role-based filtering
        if (req.user.role === 'user') {
            query.userId = req.user._id;
        } else if (req.user.role === 'restaurant_manager') {
            const restaurant = await Restaurant.findOne({ managerId: req.user._id });
            if (restaurant) {
                query.restaurantId = restaurant._id;
            } else {
                return res.json([]);
            }
        }
        // super_admin can see all reservations

        const { status, date, restaurantId } = req.query;

        if (status) query.status = status;
        if (restaurantId) query.restaurantId = restaurantId;
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.date = { $gte: startDate, $lt: endDate };
        }

        const reservations = await Reservation.find(query)
            .populate('userId', 'name email')
            .populate('restaurantId', 'name location')
            .sort({ date: -1, time: 1 });

        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create reservation (user)
router.post('/', authenticate, async (req, res) => {
    try {
        const { restaurantId, date, time, partySize, specialRequests, contactPhone } = req.body;

        // Check if restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Check table availability
        const existingReservation = await Reservation.findOne({
            restaurantId,
            date: new Date(date),
            time,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (existingReservation) {
            return res.status(400).json({ message: 'Table not available at this time' });
        }

        const reservation = new Reservation({
            userId: req.user._id,
            restaurantId,
            date,
            time,
            partySize,
            specialRequests,
            contactPhone
        });

        await reservation.save();

        const populatedReservation = await Reservation.findById(reservation._id)
            .populate('userId', 'name email')
            .populate('restaurantId', 'name location');

        res.status(201).json(populatedReservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update reservation status (restaurant_manager or super_admin)
router.put('/:id/status', authenticate, authorize('super_admin', 'restaurant_manager'), async (req, res) => {
    try {
        const { status, tableNumber } = req.body;

        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // For restaurant managers, check ownership
        if (req.user.role === 'restaurant_manager') {
            const restaurant = await Restaurant.findOne({ managerId: req.user._id });
            if (!restaurant || restaurant._id.toString() !== reservation.restaurantId.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this reservation' });
            }
        }

        reservation.status = status;
        if (tableNumber) reservation.tableNumber = tableNumber;

        await reservation.save();

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Cancel reservation (user who made it, or restaurant_manager, or super_admin)
router.put('/:id/cancel', authenticate, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Check authorization
        const isOwner = reservation.userId.toString() === req.user._id.toString();
        const isManager = req.user.role === 'restaurant_manager';
        const isAdmin = req.user.role === 'super_admin';

        if (!isOwner && !isManager && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
        }

        reservation.status = 'cancelled';
        await reservation.save();

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete reservation (super_admin only)
router.delete('/:id', authenticate, authorize('super_admin'), async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
