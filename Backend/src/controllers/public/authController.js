import jwt from 'jsonwebtoken';
import User, { LOYALTY_POINTS, getTierFromPoints } from '../../models/User.js';
import LoyaltyTransaction from '../../models/LoyaltyTransaction.js';

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
    );
};

// Register
export const register = async (req, res) => {
    try {
        const { name, email, password, role, referralCode } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = new User({
            name,
            email,
            password,
            role: role || 'user',
            memberSince: new Date()
        });

        await user.save();

        // Award welcome bonus points
        user.loyaltyPoints = LOYALTY_POINTS.WELCOME_BONUS;
        user.loyaltyTier = getTierFromPoints(user.loyaltyPoints).name;

        // Create loyalty transaction for welcome bonus
        await LoyaltyTransaction.create({
            userId: user._id,
            points: LOYALTY_POINTS.WELCOME_BONUS,
            type: 'WELCOME_BONUS',
            description: 'Welcome bonus - Account signup',
            balanceAfter: user.loyaltyPoints
        });

        // Handle referral if provided
        if (referralCode) {
            const referringUser = await User.findOne({ referralCode });
            if (referringUser && !referringUser._id.equals(user._id)) {
                // Award points to referrer
                referringUser.loyaltyPoints += LOYALTY_POINTS.REFERRAL;
                referringUser.loyaltyTier = getTierFromPoints(referringUser.loyaltyPoints).name;
                if (!referringUser.referredUsers) {
                    referringUser.referredUsers = [];
                }
                referringUser.referredUsers.push(user._id);

                await LoyaltyTransaction.create({
                    userId: referringUser._id,
                    points: LOYALTY_POINTS.REFERRAL,
                    type: 'REFERRAL',
                    description: 'Referral bonus - friend signed up',
                    relatedId: user._id,
                    relatedModel: 'User',
                    balanceAfter: referringUser.loyaltyPoints
                });

                await referringUser.save();

                // Mark current user as referred
                user.referredBy = referringUser._id;
            }
        }

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                loyaltyPoints: user.loyaltyPoints,
                loyaltyTier: user.loyaltyTier
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(400).json({ message: 'Account is deactivated' });
        }

        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                restaurantId: user.restaurantId,
                loyaltyPoints: user.loyaltyPoints,
                loyaltyTier: user.loyaltyTier
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get current user
export const getMe = async (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            restaurantId: req.user.restaurantId,
            loyaltyPoints: req.user.loyaltyPoints,
            loyaltyTier: req.user.loyaltyTier
        }
    });
};
