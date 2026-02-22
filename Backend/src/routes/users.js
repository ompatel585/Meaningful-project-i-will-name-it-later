import express from 'express';
import User from '../models/User.js';
import Reservation from '../models/Reservation.js';
import Review from '../models/Review.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/users/profile - Get current user profile
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/users/profile - Update current user profile
router.put('/profile', async (req, res) => {
    try {
        const { name, phone, avatar } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (avatar) user.avatar = avatar;

        await user.save();

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/users/password - Change password
router.put('/password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/users/reservations - Get user's reservations
router.get('/reservations', async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        let query = { userId: req.user._id };

        if (status) {
            query.status = status;
        }

        const reservations = await Reservation.find(query)
            .populate('restaurantId', 'name location images cuisine priceRange')
            .sort({ date: -1, time: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Reservation.countDocuments(query);

        res.json({
            reservations,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/users/reservations/:id - Get single reservation
router.get('/reservations/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            _id: req.params.id,
            userId: req.user._id
        }).populate('restaurantId', 'name location images cuisine priceRange phone');

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/users/reviews - Get user's reviews
router.get('/reviews', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const reviews = await Review.find({ userId: req.user._id })
            .populate('restaurantId', 'name images location')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Review.countDocuments({ userId: req.user._id });

        res.json({
            reviews,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/users/favorites - Get favorite restaurants
router.get('/favorites', async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'favorites',
                populate: { path: 'ownerId', select: 'name email' }
            });

        res.json(user.favorites || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/users/favorites/:restaurantId - Add to favorites
router.post('/favorites/:restaurantId', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user.favorites) {
            user.favorites = [];
        }

        if (user.favorites.includes(req.params.restaurantId)) {
            return res.status(400).json({ message: 'Restaurant already in favorites' });
        }

        user.favorites.push(req.params.restaurantId);
        await user.save();

        res.json({ message: 'Added to favorites' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/users/favorites/:restaurantId - Remove from favorites
router.delete('/favorites/:restaurantId', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user.favorites) {
            user.favorites = [];
        }

        user.favorites = user.favorites.filter(
            id => id.toString() !== req.params.restaurantId
        );

        await user.save();

        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/users/notifications - Get user notifications
router.get('/notifications', async (req, res) => {
    try {
        // This would be expanded to use a Notification model
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
