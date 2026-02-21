import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (!user.isActive) {
            return res.status(401).json({ message: 'User account is deactivated' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};

// Middleware factory for checking if user owns resource or is super_admin
export const authorizeOwnerOrAdmin = (getResourceOwnerId) => {
    return (req, res, next) => {
        const resourceOwnerId = getResourceOwnerId(req);

        if (req.user.role === 'super_admin') {
            return next();
        }

        if (req.user.role === 'restaurant_owner' && req.user.restaurantId) {
            if (req.user.restaurantId.toString() === resourceOwnerId) {
                return next();
            }
        }

        if (req.user._id.toString() === resourceOwnerId) {
            return next();
        }

        return res.status(403).json({ message: 'Not authorized to access this resource' });
    };
};

// Middleware to check if user is restaurant owner
export const isRestaurantOwner = (req, res, next) => {
    if (req.user.role !== 'restaurant_owner') {
        return res.status(403).json({
            message: 'Access denied. Restaurant owner role required.'
        });
    }
    next();
};
