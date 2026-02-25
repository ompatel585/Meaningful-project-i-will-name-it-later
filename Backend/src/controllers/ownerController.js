import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import Restaurant from '../models/Restaurant.js';
import Reservation from '../models/Reservation.js';
import Review from '../models/Review.js';

// Configure multer for Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'restaurant-images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 1200, height: 800, crop: 'limit' }]
    }
});

const upload = multer({ storage: storage });

// GET /api/owners/dashboard - Get dashboard stats
export const getDashboard = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Get reservations stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayReservations = await Reservation.countDocuments({
            restaurantId: restaurant._id,
            date: { $gte: today, $lt: tomorrow },
            status: { $in: ['pending', 'confirmed'] }
        });

        const totalReservations = await Reservation.countDocuments({
            restaurantId: restaurant._id
        });

        const confirmedReservations = await Reservation.countDocuments({
            restaurantId: restaurant._id,
            status: 'confirmed'
        });

        const pendingReservations = await Reservation.countDocuments({
            restaurantId: restaurant._id,
            status: 'pending'
        });

        // Get reviews stats
        const totalReviews = await Review.countDocuments({
            restaurantId: restaurant._id
        });

        const avgRating = await Review.aggregate([
            { $match: { restaurantId: restaurant._id } },
            { $group: { _id: null, avg: { $avg: '$rating' } } }
        ]);

        // Get upcoming reservations
        const upcomingReservations = await Reservation.find({
            restaurantId: restaurant._id,
            date: { $gte: today },
            status: { $in: ['pending', 'confirmed'] }
        })
            .populate('userId', 'name email')
            .sort({ date: 1, time: 1 })
            .limit(5);

        // Get recent reviews
        const recentReviews = await Review.find({
            restaurantId: restaurant._id
        })
            .populate('userId', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            stats: {
                todayReservations,
                totalReservations,
                confirmedReservations,
                pendingReservations,
                totalReviews,
                avgRating: avgRating[0]?.avg?.toFixed(1) || 0
            },
            restaurant,
            upcomingReservations,
            recentReviews
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/owners/restaurant - Get my restaurant
export const getMyRestaurant = async (req, res) => {
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
};

// PUT /api/owners/restaurant - Update restaurant
export const updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const {
            name,
            description,
            cuisine,
            phone,
            email,
            website,
            location,
            operatingHours,
            priceRange,
            seatingCapacity,
            amenities,
            images
        } = req.body;

        if (name) restaurant.name = name;
        if (description) restaurant.description = description;
        if (cuisine) restaurant.cuisine = cuisine;
        if (phone) restaurant.phone = phone;
        if (email) restaurant.email = email;
        if (website) restaurant.website = website;
        if (location) restaurant.location = location;
        if (operatingHours) restaurant.operatingHours = operatingHours;
        if (priceRange) restaurant.priceRange = priceRange;
        if (seatingCapacity) restaurant.seatingCapacity = seatingCapacity;
        if (amenities) restaurant.amenities = amenities;
        if (images) restaurant.images = images;

        await restaurant.save();

        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/owners/restaurant/images - Upload images
export const uploadImages = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const imageUrls = req.files.map(file => file.path);
        restaurant.images = [...restaurant.images, ...imageUrls];
        await restaurant.save();

        res.json({
            message: 'Images uploaded successfully',
            images: restaurant.images
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/owners/restaurant/images - Delete image
export const deleteImage = async (req, res) => {
    try {
        const { imageUrl } = req.body;
        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        restaurant.images = restaurant.images.filter(img => img !== imageUrl);
        await restaurant.save();

        res.json({
            message: 'Image deleted successfully',
            images: restaurant.images
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/owners/reservations - Get all reservations for my restaurant
export const getReservations = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const { status, date, page = 1, limit = 20 } = req.query;

        let query = { restaurantId: restaurant._id };

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
            .populate('userId', 'name email phone')
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
};

// PUT /api/owners/reservations/:id - Update reservation status
export const updateReservation = async (req, res) => {
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
};

// GET /api/owners/reviews - Get reviews for my restaurant
export const getReviews = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const { page = 1, limit = 20, sort = 'newest' } = req.query;

        let sortOption = { createdAt: -1 };
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        if (sort === 'highest') sortOption = { rating: -1 };
        if (sort === 'lowest') sortOption = { rating: 1 };

        const reviews = await Review.find({ restaurantId: restaurant._id })
            .populate('userId', 'name')
            .sort(sortOption)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Review.countDocuments({ restaurantId: restaurant._id });

        // Get rating distribution
        const ratingDistribution = await Review.aggregate([
            { $match: { restaurantId: restaurant._id } },
            { $group: { _id: '$rating', count: { $sum: 1 } } }
        ]);

        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratingDistribution.forEach(item => {
            distribution[item._id] = item.count;
        });

        // Get average rating
        const avgRating = await Review.aggregate([
            { $match: { restaurantId: restaurant._id } },
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
};

// PUT /api/owners/reviews/:id/respond - Respond to a review
export const respondToReview = async (req, res) => {
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
            respondedAt: Date.now(),
            respondedBy: req.user._id
        };

        await review.save();

        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { upload };
