import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../config/cloudinary.js';
import Restaurant from '../../models/Restaurant.js';
import User from '../../models/User.js';
import Review from '../../models/Review.js';

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

// Get all restaurants (public)
export const getAllRestaurants = async (req, res) => {
    try {
        const { city, cuisine, search, priceRange, minRating } = req.query;

        let query = { isActive: true };

        if (city) {
            query['location.city'] = new RegExp(city, 'i');
        }

        if (cuisine) {
            query.cuisine = new RegExp(cuisine, 'i');
        }

        if (priceRange) {
            // priceRange can be a single number (1-4) or comma-separated (e.g., "1,2" for $ and $$)
            const priceRanges = priceRange.split(',').map(p => parseInt(p.trim()));
            query.priceRange = { $in: priceRanges };
        }

        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { cuisine: new RegExp(search, 'i') }
            ];
        }

        let restaurants = await Restaurant.find(query).populate('ownerId', 'name email');

        // Filter by rating if minRating is specified
        if (minRating) {
            // Get all restaurants and calculate their average ratings
            const restaurantsWithRatings = await Promise.all(
                restaurants.map(async (restaurant) => {
                    const reviews = await Review.find({ restaurantId: restaurant._id });
                    const avgRating = reviews.length > 0
                        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                        : 0;
                    return { ...restaurant.toObject(), averageRating: avgRating };
                })
            );

            // Filter by minimum rating
            restaurants = restaurantsWithRatings.filter(r => r.averageRating >= parseFloat(minRating));
        }

        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single restaurant (public)
export const getRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).populate('ownerId', 'name email');

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create restaurant (super_admin or restaurant_owner)
export const createRestaurant = async (req, res) => {
    try {
        const { name, description, location, cuisine, operatingHours, tables } = req.body;

        // Get uploaded Cloudinary image URLs
        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        const restaurant = new Restaurant({
            name,
            description,
            location,
            cuisine,
            images: imageUrls,
            operatingHours,
            tables: tables || [],
            ownerId: req.user.role === 'super_admin'
                ? req.body.ownerId
                : req.user._id
        });

        await restaurant.save();

        if (req.user.role === 'restaurant_owner') {
            await User.findByIdAndUpdate(req.user._id, {
                restaurantId: restaurant._id
            });
        }

        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update restaurant (super_admin or owning restaurant_owner)
export const updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Check ownership for restaurant owner
        if (req.user.role === 'restaurant_owner' &&
            restaurant.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this restaurant' });
        }

        // Handle image uploads if any
        if (req.files && req.files.length > 0) {
            let currentImages = req.body.images || [];
            if (typeof currentImages === 'string') {
                currentImages = [currentImages];
            }
            const uploadedImageUrls = req.files.map(file => file.path);
            req.body.images = [...currentImages, ...uploadedImageUrls];
        } else if (req.body.images && typeof req.body.images === 'string') {
            req.body.images = [req.body.images];
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedRestaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete restaurant (super_admin only)
export const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Remove restaurantId from the owner
        await User.findOneAndUpdate(
            { restaurantId: req.params.id },
            { restaurantId: null }
        );

        res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get my restaurant (for restaurant_owner)
export const getMyRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Upload restaurant images (Cloudinary only)
export const uploadImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No images uploaded' });
        }

        // Return full Cloudinary response details
        const images = req.files.map(file => ({
            url: file.path,
            public_id: file.filename,
            original_name: file.originalname,
            format: file.mimetype
        }));

        res.json({
            message: 'Images uploaded successfully',
            images: images
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch images directly from Cloudinary
export const getCloudinaryImages = async (req, res) => {
    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'restaurant-images',
            max_results: 50
        });

        res.json({ images: result.resources });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete restaurant image (for restaurant_owner)
export const deleteImage = async (req, res) => {
    try {
        const { imageUrl } = req.body;
        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Remove image from array
        restaurant.images = restaurant.images.filter(img => img !== imageUrl);
        await restaurant.save();

        // Try to delete from Cloudinary (optional - will fail silently if not found)
        try {
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`restaurant-images/${publicId}`);
        } catch (cloudinaryError) {
            console.log('Cloudinary delete error (non-critical):', cloudinaryError.message);
        }

        res.json({
            message: 'Image deleted successfully',
            images: restaurant.images
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { upload };
