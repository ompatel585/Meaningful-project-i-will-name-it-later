import express from 'express';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all restaurants (public)
router.get('/', async (req, res) => {
    try {
        const { city, cuisine, search } = req.query;

        let query = { isActive: true };

        if (city) {
            query['location.city'] = new RegExp(city, 'i');
        }

        if (cuisine) {
            query.cuisine = new RegExp(cuisine, 'i');
        }

        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { cuisine: new RegExp(search, 'i') }
            ];
        }

        const restaurants = await Restaurant.find(query).populate('ownerId', 'name email');
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single restaurant (public)
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).populate('ownerId', 'name email');

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create restaurant (super_admin or restaurant_owner)
router.post('/', authenticate, authorize('super_admin', 'restaurant_owner'), async (req, res) => {
    try {
        const { name, description, location, cuisine, images, operatingHours, tables } = req.body;

        const restaurant = new Restaurant({
            name,
            description,
            location,
            cuisine,
            images: images || [],
            operatingHours,
            tables: tables || [],
            ownerId: req.user.role === 'super_admin' ? req.body.ownerId : req.user._id
        });

        await restaurant.save();

        // If restaurant owner, update user's restaurantId
        if (req.user.role === 'restaurant_owner') {
            await User.findByIdAndUpdate(req.user._id, { restaurantId: restaurant._id });
        }

        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update restaurant (super_admin or owning restaurant_owner)
router.put('/:id', authenticate, authorize('super_admin', 'restaurant_owner'), async (req, res) => {
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

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedRestaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete restaurant (super_admin only)
router.delete('/:id', authenticate, authorize('super_admin'), async (req, res) => {
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
});

// Get my restaurant (for restaurant_owner)
router.get('/owner/my-restaurant', authenticate, authorize('restaurant_owner'), async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
