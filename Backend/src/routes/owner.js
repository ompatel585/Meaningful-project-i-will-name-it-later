import express from 'express';
import Restaurant from '../models/Restaurant.js';
import Reservation from '../models/Reservation.js';
import Review from '../models/Review.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require restaurant_owner role
router.use(authenticate);
router.use(authorize('restaurant_owner'));

// Get Owner's Restaurant
router.get('/restaurant', async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ ownerId: req.user._id })
            .populate('ownerId', 'name email');

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Restaurant
router.put('/restaurant', async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const { name, description, location, cuisine, operatingHours, tables, images, isActive } = req.body;

        if (name) restaurant.name = name;
        if (description) restaurant.description = description;
        if (location) restaurant.location = location;
        if (cuisine) restaurant.cuisine = cuisine;
        if (operatingHours) restaurant.operatingHours = operatingHours;
        if (tables) restaurant.tables = tables;
        if (images) restaurant.images = images;
        if (isActive !== undefined) restaurant.isActive = isActive;

        await restaurant.save();

        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Reservations for Owner's Restaurant
router.get('/reservations', async (req, res) => {
    try {
        const { status, date, page = 1, limit = 10 } = req.query;

        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        let query = { restaurantId: restaurant._id };

        if (status) query.status = status;
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.date = { $gte: startDate, $lt: endDate };
        }

        const reservations = await Reservation.find(query)
            .populate('userId', 'name email phone')
            .sort({ date: -1, time: 1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Reservation.countDocuments(query);

        res.json({
            reservations,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Reservation Status
router.put('/reservations/:id', async (req, res) => {
    try {
        const { status, tableNumber, notes } = req.body;

        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const reservation = await Reservation.findOne({
            _id: req.params.id,
            restaurantId: restaurant._id
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        if (status) reservation.status = status;
        if (tableNumber) reservation.tableNumber = tableNumber;
        if (notes) reservation.notes = notes;

        await reservation.save();

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Reviews for Owner's Restaurant
router.get('/reviews', async (req, res) => {
    try {
        const { rating, page = 1, limit = 10 } = req.query;

        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        let query = { restaurantId: restaurant._id };
        if (rating) query.rating = rating;

        const reviews = await Review.find(query)
            .populate('userId', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Review.countDocuments(query);

        // Calculate average rating
        const avgResult = await Review.aggregate([
            { $match: { restaurantId: restaurant._id } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);

        res.json({
            reviews,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            avgRating: avgResult[0]?.avgRating?.toFixed(1) || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Respond to Review
router.post('/reviews/:id/respond', async (req, res) => {
    try {
        const { response } = req.body;

        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const review = await Review.findOne({
            _id: req.params.id,
            restaurantId: restaurant._id
        });

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.response = {
            text: response,
            respondedAt: new Date(),
            respondedBy: req.user._id
        };

        await review.save();

        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Dashboard Stats
router.get('/dashboard', async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Today's reservations
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayReservations = await Reservation.countDocuments({
            restaurantId: restaurant._id,
            date: { $gte: today, $lt: tomorrow },
            status: { $in: ['pending', 'confirmed'] }
        });

        // Total reservations
        const totalReservations = await Reservation.countDocuments({
            restaurantId: restaurant._id
        });

        // Average rating
        const avgResult = await Review.aggregate([
            { $match: { restaurantId: restaurant._id } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);

        // Total reviews
        const totalReviews = await Review.countDocuments({
            restaurantId: restaurant._id
        });

        // Recent reviews
        const recentReviews = await Review.find({ restaurantId: restaurant._id })
            .populate('userId', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        // Upcoming reservations
        const upcomingReservations = await Reservation.find({
            restaurantId: restaurant._id,
            date: { $gte: today },
            status: { $in: ['pending', 'confirmed'] }
        })
            .populate('userId', 'name email')
            .sort({ date: 1, time: 1 })
            .limit(5);

        res.json({
            stats: {
                todayReservations,
                totalReservations,
                avgRating: avgResult[0]?.avgRating?.toFixed(1) || 0,
                totalReviews
            },
            recentReviews,
            upcomingReservations
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Analytics
router.get('/analytics', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
        const end = endDate ? new Date(endDate) : new Date();

        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Reservations by day
        const reservationsByDay = await Reservation.aggregate([
            {
                $match: {
                    restaurantId: restaurant._id,
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Reservations by status
        const reservationsByStatus = await Reservation.aggregate([
            {
                $match: { restaurantId: restaurant._id }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Peak hours
        const peakHours = await Reservation.aggregate([
            {
                $match: { restaurantId: restaurant._id }
            },
            {
                $group: {
                    _id: '$time',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            reservationsByDay,
            reservationsByStatus,
            peakHours
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
