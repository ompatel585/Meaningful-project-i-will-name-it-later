import express from 'express';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Reservation from '../models/Reservation.js';
import Review from '../models/Review.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require super_admin role
router.use(authenticate);
router.use(authorize('super_admin'));

// Dashboard Stats
router.get('/dashboard', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalRestaurants = await Restaurant.countDocuments();
        const totalReservations = await Reservation.countDocuments();
        const totalReviews = await Review.countDocuments();

        // Get recent users
        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get recent reservations
        const recentReservations = await Reservation.find()
            .populate('userId', 'name email')
            .populate('restaurantId', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get pending restaurant applications
        const pendingApplications = await Restaurant.countDocuments({ status: 'pending' });

        res.json({
            stats: {
                totalUsers,
                totalRestaurants,
                totalReservations,
                totalReviews,
                pendingApplications
            },
            recentUsers,
            recentReservations
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// User Management
router.get('/users', async (req, res) => {
    try {
        const { role, search, page = 1, limit = 10 } = req.query;

        let query = {};
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        res.json({
            users,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/users/:id/role', async (req, res) => {
    try {
        const { role, restaurantId } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        if (restaurantId) user.restaurantId = restaurantId;
        await user.save();

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            restaurantId: user.restaurantId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/users/:id/status', async (req, res) => {
    try {
        const { isActive } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = isActive;
        await user.save();

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            isActive: user.isActive
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Restaurant Management
router.get('/restaurants', async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;

        let query = {};
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { cuisine: new RegExp(search, 'i') }
            ];
        }

        const restaurants = await Restaurant.find(query)
            .populate('ownerId', 'name email')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Restaurant.countDocuments(query);

        res.json({
            restaurants,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/restaurants/:id/approve', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        restaurant.status = 'approved';
        await restaurant.save();

        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/restaurants/:id/reject', async (req, res) => {
    try {
        const { reason } = req.body;
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        restaurant.status = 'rejected';
        restaurant.rejectionReason = reason;
        await restaurant.save();

        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/restaurants/:id/featured', async (req, res) => {
    try {
        const { isFeatured } = req.body;
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        restaurant.isFeatured = isFeatured;
        await restaurant.save();

        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Analytics
router.get('/analytics', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
        const end = endDate ? new Date(endDate) : new Date();

        // Reservations by day
        const reservationsByDay = await Reservation.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Users by role
        const usersByRole = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        // Top restaurants by reservations
        const topRestaurants = await Reservation.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: '$restaurantId',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'restaurants',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'restaurant'
                }
            },
            { $unwind: '$restaurant' },
            {
                $project: {
                    name: '$restaurant.name',
                    count: 1
                }
            }
        ]);

        res.json({
            reservationsByDay,
            usersByRole,
            topRestaurants
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// System Settings (placeholder)
router.get('/settings', async (req, res) => {
    try {
        res.json({
            siteName: 'ReserveTable',
            commissionRate: 10,
            supportEmail: 'support@reservetable.com',
            maintenanceMode: false
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/settings', async (req, res) => {
    try {
        // In a real app, this would update settings in database
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
