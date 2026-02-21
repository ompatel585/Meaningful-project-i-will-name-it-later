import express from 'express';
import RestaurantApplication from '../models/RestaurantApplication.js';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply to become restaurant owner
router.post('/apply-restaurant', authenticate, async (req, res) => {
    try {
        const user = req.user;

        // Check if user is already a restaurant owner
        if (user.role === 'restaurant_owner') {
            return res.status(400).json({
                message: 'You are already a restaurant owner'
            });
        }

        // Check if user already has a pending application
        const existingApplication = await RestaurantApplication.findOne({
            userId: user._id,
            status: 'pending'
        });

        if (existingApplication) {
            return res.status(400).json({
                message: 'You already have a pending application'
            });
        }

        // Check if user has a rejected application - allow reapply after 30 days
        const rejectedApplication = await RestaurantApplication.findOne({
            userId: user._id,
            status: 'rejected'
        }).sort({ createdAt: -1 });

        if (rejectedApplication) {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            if (rejectedApplication.createdAt > thirtyDaysAgo) {
                return res.status(400).json({
                    message: 'You cannot apply again yet. Please wait 30 days after rejection.'
                });
            }
        }

        const {
            restaurantName,
            ownerName,
            phone,
            email,
            address,
            cuisine,
            description,
            licenseNumber,
            businessProof
        } = req.body;

        // Create application
        const application = new RestaurantApplication({
            userId: user._id,
            restaurantName,
            ownerName: ownerName || user.name,
            phone,
            email,
            address,
            cuisine,
            description,
            licenseNumber,
            businessProof
        });

        await application.save();

        res.status(201).json({
            message: 'Application submitted successfully',
            application
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get current user's application status
router.get('/my-application', authenticate, async (req, res) => {
    try {
        const application = await RestaurantApplication.findOne({
            userId: req.user._id
        }).sort({ createdAt: -1 });

        if (!application) {
            return res.status(404).json({
                message: 'No application found',
                hasApplication: false
            });
        }

        res.json({
            hasApplication: true,
            application
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all applications (super_admin only)
router.get('/admin/restaurant-applications',
    authenticate,
    authorize('super_admin'),
    async (req, res) => {
        try {
            const { status, page = 1, limit = 10 } = req.query;

            let query = {};
            if (status) {
                query.status = status;
            }

            const applications = await RestaurantApplication.find(query)
                .populate('userId', 'name email')
                .populate('reviewedBy', 'name')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            const total = await RestaurantApplication.countDocuments(query);

            res.json({
                applications,
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

// Approve application (super_admin only)
router.put('/admin/restaurant-applications/:id/approve',
    authenticate,
    authorize('super_admin'),
    async (req, res) => {
        try {
            const application = await RestaurantApplication.findById(req.params.id)
                .populate('userId', 'name email');

            if (!application) {
                return res.status(404).json({ message: 'Application not found' });
            }

            if (application.status !== 'pending') {
                return res.status(400).json({
                    message: `Application is already ${application.status}`
                });
            }

            // Create restaurant
            const restaurant = new Restaurant({
                name: application.restaurantName,
                ownerId: application.userId._id,
                location: {
                    address: application.address,
                    city: '', // Will be filled by owner later
                    state: '',
                    zipCode: ''
                },
                cuisine: application.cuisine,
                description: application.description,
                phone: application.phone,
                isVerified: true
            });

            await restaurant.save();

            // Update user role to restaurant_owner
            await User.findByIdAndUpdate(application.userId._id, {
                role: 'restaurant_owner',
                restaurantId: restaurant._id
            });

            // Update application status
            application.status = 'approved';
            application.reviewedBy = req.user._id;
            application.reviewedAt = new Date();
            application.adminNotes = req.body.notes || 'Application approved';

            await application.save();

            res.json({
                message: 'Application approved successfully',
                application,
                restaurant
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// Reject application (super_admin only)
router.put('/admin/restaurant-applications/:id/reject',
    authenticate,
    authorize('super_admin'),
    async (req, res) => {
        try {
            const application = await RestaurantApplication.findById(req.params.id)
                .populate('userId', 'name email');

            if (!application) {
                return res.status(404).json({ message: 'Application not found' });
            }

            if (application.status !== 'pending') {
                return res.status(400).json({
                    message: `Application is already ${application.status}`
                });
            }

            // Update application status
            application.status = 'rejected';
            application.reviewedBy = req.user._id;
            application.reviewedAt = new Date();
            application.adminNotes = req.body.notes || 'Application rejected';

            await application.save();

            res.json({
                message: 'Application rejected',
                application
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

export default router;
