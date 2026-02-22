import express from 'express';
import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';
import { auth, restaurantOwnerAuth } from '../middleware/auth.js';

const router = express.Router();

// Get reviews for a restaurant (public)
router.get('/restaurant/:restaurantId', async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const { page = 1, limit = 10, sort = 'newest' } = req.query;

        let sortOption = { createdAt: -1 };
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        if (sort === 'highest') sortOption = { rating: -1 };
        if (sort === 'lowest') sortOption = { rating: 1 };

        const reviews = await Review.find({ restaurantId })
            .populate('userId', 'name')
            .populate('response.respondedBy', 'name')
            .sort(sortOption)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Review.countDocuments({ restaurantId });

        // Calculate rating distribution
        const ratingDistribution = await Review.aggregate([
            { $match: { restaurantId: mongoose.Types.ObjectId(restaurantId) } },
            { $group: { _id: '$rating', count: { $sum: 1 } } }
        ]);

        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratingDistribution.forEach(item => {
            distribution[item._id] = item.count;
        });

        // Calculate average rating
        const avgRating = await Review.aggregate([
            { $match: { restaurantId: mongoose.Types.ObjectId(restaurantId) } },
            { $group: { _id: null, avg: { $avg: '$rating' } } }
        ]);

        res.json({
            reviews,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            avgRating: avgRating[0]?.avg?.toFixed(1) || 0,
            distribution
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a review (authenticated users)
router.post('/', auth, async (req, res) => {
    try {
        const { restaurantId, rating, comment, visitDate } = req.body;

        // Check if restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Check if user already reviewed this restaurant
        const existingReview = await Review.findOne({
            userId: req.user.id,
            restaurantId
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this restaurant' });
        }

        const review = new Review({
            restaurantId,
            userId: req.user.id,
            rating,
            comment,
            visitDate: visitDate || Date.now()
        });

        await review.save();

        // Update restaurant average rating
        const avgRating = await Review.aggregate([
            { $match: { restaurantId: mongoose.Types.ObjectId(restaurantId) } },
            { $group: { _id: null, avg: { $avg: '$rating' } } }
        ]);

        if (avgRating[0]) {
            restaurant.avgRating = avgRating[0].avg;
            await restaurant.save();
        }

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get restaurant owner's reviews
router.get('/owner/my-restaurant-reviews', auth, restaurantOwnerAuth, async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ ownerId: req.user.id });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const { page = 1, limit = 10 } = req.query;

        const reviews = await Review.find({ restaurantId: restaurant._id })
            .populate('userId', 'name email')
            .populate('response.respondedBy', 'name')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Review.countDocuments({ restaurantId: restaurant._id });

        // Get analytics
        const analytics = await Review.aggregate([
            { $match: { restaurantId: restaurant._id } },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 },
                    fiveStar: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
                    fourStar: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
                    threeStar: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
                    twoStar: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
                    oneStar: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
                }
            }
        ]);

        // Get recent reviews count by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyReviews = await Review.aggregate([
            {
                $match: {
                    restaurantId: restaurant._id,
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    count: { $sum: 1 },
                    avgRating: { $avg: '$rating' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            reviews,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            analytics: analytics[0] || {
                avgRating: 0,
                totalReviews: 0,
                fiveStar: 0,
                fourStar: 0,
                threeStar: 0,
                twoStar: 0,
                oneStar: 0
            },
            monthlyReviews
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Respond to a review (restaurant owner)
router.put('/:reviewId/respond', auth, restaurantOwnerAuth, async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { response } = req.body;

        const restaurant = await Restaurant.findOne({ ownerId: req.user.id });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const review = await Review.findOne({
            _id: reviewId,
            restaurantId: restaurant._id
        });

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.response = {
            text: response,
            respondedAt: Date.now(),
            respondedBy: req.user.id
        };

        await review.save();

        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a review (admin or owner)
router.delete('/:reviewId', auth, async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user is admin or the review author
        if (req.user.role !== 'super_admin' && req.user.id !== review.userId.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Review.findByIdAndDelete(reviewId);

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
