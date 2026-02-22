import express from 'express';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Reservation from '../models/Reservation.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user profile
router.put('/profile', async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        const user = await User.findById(req.user._id);

        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;

        await user.save();

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Change password
router.put('/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get favorite restaurants
router.get('/favorites', async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'favorites',
                populate: { path: 'ownerId', select: 'name' }
            });

        res.json(user.favorites || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add to favorites
router.post('/favorites/:restaurantId', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user.favorites) {
            user.favorites = [];
        }

        if (user.favorites.includes(req.params.restaurantId)) {
            return res.status(400).json({ message: 'Restaurant already in favorites' });
        }

        const restaurant = await Restaurant.findById(req.params.restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        user.favorites.push(req.params.restaurantId);
        await user.save();

        res.json({ message: 'Added to favorites', favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove from favorites
router.delete('/favorites/:restaurantId', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user.favorites) {
            user.favorites = [];
        }

        user.favorites = user.favorites.filter(
            f => f.toString() !== req.params.restaurantId
        );
        await user.save();

        res.json({ message: 'Removed from favorites', favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get reservation history
router.get('/reservations', async (req, res) => {
    try {
        const { status, limit = 10, page = 1 } = req.query;

        let query = { userId: req.user._id };

        if (status) {
            query.status = status;
        }

        const reservations = await Reservation.find(query)
            .populate('restaurantId', 'name location images')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Reservation.countDocuments(query);

        res.json({
            reservations,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get notification preferences
router.get('/notifications', async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('notificationPreferences');
        res.json(user.notificationPreferences || {
            email: true,
            sms: false,
            reservationReminder: true,
            promotionalEmails: false
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update notification preferences
router.put('/notifications', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        user.notificationPreferences = req.body;
        await user.save();

        res.json(user.notificationPreferences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
