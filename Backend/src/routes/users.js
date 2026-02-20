import express from 'express';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all users (super_admin only)
router.get('/', authenticate, authorize('super_admin'), async (req, res) => {
    try {
        const { role, search } = req.query;

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

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user by ID (super_admin only)
router.get('/:id', authenticate, authorize('super_admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create user (super_admin only)
router.post('/', authenticate, authorize('super_admin'), async (req, res) => {
    try {
        const { name, email, password, role, restaurantId } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({
            name,
            email,
            password,
            role,
            restaurantId
        });

        await user.save();

        res.status(201).json({
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

// Update user (super_admin only)
router.put('/:id', authenticate, authorize('super_admin'), async (req, res) => {
    try {
        const { name, email, role, restaurantId, isActive } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (restaurantId !== undefined) user.restaurantId = restaurantId;
        if (isActive !== undefined) user.isActive = isActive;

        await user.save();

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            restaurantId: user.restaurantId,
            isActive: user.isActive
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user (super_admin only)
router.delete('/:id', authenticate, authorize('super_admin'), async (req, res) => {
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

// Toggle user active status (super_admin only)
router.put('/:id/toggle-active', authenticate, authorize('super_admin'), async (req, res) => {
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

export default router;
