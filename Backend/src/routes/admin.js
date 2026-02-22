import express from 'express';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Reservation from '../models/Reservation.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require super_admin role
router.use(authenticate);
router.use(authorize('super_admin'));

// GET /api/admin/stats - Dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalRestaurants = await Restaurant.countDocuments();
        const totalReservations = await Reservation.countDocuments();

        const pendingApplications = await Restaurant.countDocuments({ isVerified: false });

        // Get recent registrations
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('-password');

        // Get recent reservations
        const recentReservations = await Reservation.find()
            .populate('userId', 'name')
            .populate('restaurantId', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            stats: {
                totalUsers,
                totalRestaurants,
                totalReservations,
                pendingApplications
            },
            recentUsers,
            recentReservations
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/users - Get all users with filtering
router.get('/users', async (req, res) => {
    try {
        const { role, search, page = 1, limit = 20 } = req.query;

        let query = {};

        if (role) {
            query.role = role;
        }

        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await User.countDocuments(query);

        res.json({
            users,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/restaurants - Get all restaurants
router.get('/restaurants', async (req, res) => {
    try {
        const { verified, search, page = 1, limit = 20 } = req.query;

        let query = {};

        if (verified !== undefined) {
            query.isVerified = verified === 'true';
        }

        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { cuisine: new RegExp(search, 'i') }
            ];
        }

        const restaurants = await Restaurant.find(query)
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Restaurant.countDocuments(query);

        res.json({
            restaurants,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/reservations - Get all reservations
router.get('/reservations', async (req, res) => {
    try {
        const { status, date, page = 1, limit = 20 } = req.query;

        let query = {};

        if (status) {
            query.status = status;
        }

        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.date = { $gte: startDate, $lt: endDate };
        }

        const reservations = await Reservation.find(query)
            .populate('userId', 'name email')
            .populate('restaurantId', 'name location')
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

// PUT /api/admin/users/:id/status - Toggle user active status
router.put('/users/:id/status', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = !user.isActive;
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

// PUT /api/admin/restaurants/:id/verify - Verify restaurant
router.put('/restaurants/:id/verify', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        restaurant.isVerified = true;
        await restaurant.save();

        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/admin/restaurants/:id/featured - Toggle featured status
router.put('/restaurants/:id/featured', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        restaurant.isFeatured = !restaurant.isFeatured;
        await restaurant.save();

        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/admin/restaurants/:id - Delete restaurant
router.delete('/restaurants/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/stats/analytics - Advanced analytics
router.get('/stats/analytics', async (req, res) => {
    try {
        const { period = '30' } = req.query;
        const daysAgo = parseInt(period);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);

        // User growth
        const userGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Restaurant growth
        const restaurantGrowth = await Restaurant.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Reservation trends
        const reservationTrends = await Reservation.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top restaurants by reservations
        const topRestaurants = await Reservation.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
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
                    restaurantName: '$restaurant.name',
                    count: 1
                }
            }
        ]);

        // User role distribution
        const roleDistribution = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        // Reservation status distribution
        const statusDistribution = await Reservation.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Average ratings
        const Review = (await import('../models/Review.js')).default;
        const avgRating = await Review.aggregate([
            { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
        ]);

        res.json({
            userGrowth,
            restaurantGrowth,
            reservationTrends,
            topRestaurants,
            roleDistribution,
            statusDistribution,
            avgRating: avgRating[0] || { avg: 0, count: 0 },
            period: daysAgo
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/users/:id/details - User details with reservations
router.get('/users/:id/details', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const reservations = await Reservation.find({ userId: user._id })
            .populate('restaurantId', 'name location')
            .sort({ createdAt: -1 })
            .limit(10);

        const totalReservations = await Reservation.countDocuments({ userId: user._id });

        res.json({
            user,
            reservations,
            totalReservations
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/admin/users/:id/role - Update user role
router.put('/users/:id/role', async (req, res) => {
    try {
        const { role, restaurantId } = req.body;

        const validRoles = ['super_admin', 'restaurant_owner', 'user'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        if (restaurantId) {
            user.restaurantId = restaurantId;
        }

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

// GET /api/admin/restaurants/pending - Get pending restaurants
router.get('/restaurants/pending', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const restaurants = await Restaurant.find({ isVerified: false })
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Restaurant.countDocuments({ isVerified: false });

        res.json({
            restaurants,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/reports - Generate reports
router.get('/reports', async (req, res) => {
    try {
        const { type = 'summary', startDate, endDate } = req.query;

        let query = {};
        
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const usersCount = await User.countDocuments(query);
        const restaurantsCount = await Restaurant.countDocuments(query);
        const reservationsCount = await Reservation.countDocuments(query);

        // Revenue (if there's a price field in reservations)
        const totalRevenue = await Reservation.aggregate([
            { $match: { ...query, status: 'confirmed' } },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalPrice' }
                }
            }
        ]);

        res.json({
            type,
            generatedAt: new Date().toISOString(),
            period: { startDate, endDate },
            summary: {
                totalUsers: usersCount,
                totalRestaurants: restaurantsCount,
                totalReservations: reservationsCount,
                totalRevenue: totalRevenue[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/categories - Get restaurant categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Restaurant.aggregate([
            { $unwind: '$cuisine' },
            {
                $group: {
                    _id: '$cuisine',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

