import Reservation from '../models/Reservation.js';
import Restaurant from '../models/Restaurant.js';
import User, { LOYALTY_POINTS, getTierFromPoints } from '../models/User.js';
import LoyaltyTransaction from '../models/LoyaltyTransaction.js';

// Helper function to get point description
const getPointDescription = (type) => {
    const descriptions = {
        'FIRST_RESERVATION': 'First reservation bonus',
        'PER_RESERVATION': 'Points for completed reservation',
        'MILESTONE_5': 'Milestone achieved: 5 reservations',
        'MILESTONE_10': 'Milestone achieved: 10 reservations',
        'MILESTONE_25': 'Milestone achieved: 25 reservations',
        'MILESTONE_50': 'Milestone achieved: 50 reservations',
        'THREE_MONTH_STREAK': '3-Month streak bonus',
        'FIRST_YEAR_COMPLETED': 'First year membership bonus',
        'FIRST_YEAR_MONTHLY': 'First year monthly orders bonus'
    };
    return descriptions[type] || 'Points awarded';
};

// Helper function to award reservation points
const awardReservationPoints = async (userId, reservationId) => {
    const user = await User.findById(userId);
    if (!user) return null;

    let pointsAwarded = 0;
    const pointsToAward = [];

    // Update total reservations count
    user.totalReservations = (user.totalReservations || 0) + 1;

    // Check for first reservation bonus
    if (!user.achievements.firstReservation) {
        user.achievements.firstReservation = true;
        pointsToAward.push({ type: 'FIRST_RESERVATION', points: LOYALTY_POINTS.FIRST_RESERVATION });
    }

    // Award per-reservation points
    pointsToAward.push({ type: 'PER_RESERVATION', points: LOYALTY_POINTS.PER_RESERVATION });

    // Check milestones
    if (user.totalReservations === 5 && !user.achievements.milestone5) {
        user.achievements.milestone5 = true;
        pointsToAward.push({ type: 'MILESTONE_5', points: LOYALTY_POINTS.MILESTONE_5 });
    }
    if (user.totalReservations === 10 && !user.achievements.milestone10) {
        user.achievements.milestone10 = true;
        pointsToAward.push({ type: 'MILESTONE_10', points: LOYALTY_POINTS.MILESTONE_10 });
    }
    if (user.totalReservations === 25 && !user.achievements.milestone25) {
        user.achievements.milestone25 = true;
        pointsToAward.push({ type: 'MILESTONE_25', points: LOYALTY_POINTS.MILESTONE_25 });
    }
    if (user.totalReservations === 50 && !user.achievements.milestone50) {
        user.achievements.milestone50 = true;
        pointsToAward.push({ type: 'MILESTONE_50', points: LOYALTY_POINTS.MILESTONE_50 });
    }

    // Update streak data
    const now = new Date();
    if (!user.streakData) {
        user.streakData = {
            currentStreak: 0,
            lastOrderDate: null,
            monthlyOrders: {},
            lastStreakBonus: null
        };
    }

    // Initialize monthlyOrders if needed
    if (!user.streakData.monthlyOrders) {
        user.streakData.monthlyOrders = {};
    }

    // Get current month key
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Increment monthly order count
    const currentMonthCount = user.streakData.monthlyOrders.get(currentMonthKey) || 0;
    user.streakData.monthlyOrders.set(currentMonthKey, currentMonthCount + 1);
    user.streakData.lastOrderDate = now;

    // Check for 3-month streak
    let streakCount = 0;
    for (let i = 0; i < 3; i++) {
        let checkMonth = now.getMonth() + 1 - i;
        let checkYear = now.getFullYear();

        if (checkMonth <= 0) {
            checkMonth += 12;
            checkYear -= 1;
        }

        const checkKey = `${checkYear}-${String(checkMonth).padStart(2, '0')}`;
        const monthOrders = user.streakData.monthlyOrders.get(checkKey) || 0;

        if (monthOrders > 0) {
            streakCount++;
        } else {
            break;
        }
    }

    // Award streak bonus if 3 consecutive months
    if (streakCount >= 3 && !user.achievements.threeMonthStreak) {
        user.achievements.threeMonthStreak = true;
        user.streakData.lastStreakBonus = now;
        pointsToAward.push({ type: 'THREE_MONTH_STREAK', points: LOYALTY_POINTS.THREE_MONTH_STREAK });
    }

    // Check first year achievements
    if (user.memberSince) {
        const memberDays = (now - user.memberSince) / (1000 * 60 * 60 * 24);

        if (memberDays <= 365) {
            user.firstYearMonthlyOrders = (user.firstYearMonthlyOrders || 0) + 1;

            // Check for 12 months with orders in first year
            if (user.firstYearMonthlyOrders >= 12 && !user.achievements.firstYearMonthly) {
                user.achievements.firstYearMonthly = true;
                pointsToAward.push({ type: 'FIRST_YEAR_MONTHLY', points: LOYALTY_POINTS.FIRST_YEAR_MONTHLY });
            }
        }

        // Check for first year completed
        if (memberDays >= 365 && !user.achievements.firstYearCompleted) {
            user.achievements.firstYearCompleted = true;
            pointsToAward.push({ type: 'FIRST_YEAR_COMPLETED', points: LOYALTY_POINTS.FIRST_YEAR_COMPLETED });
        }
    }

    // Award all points
    for (const award of pointsToAward) {
        user.loyaltyPoints += award.points;
        pointsAwarded += award.points;

        await LoyaltyTransaction.create({
            userId: user._id,
            points: award.points,
            type: award.type,
            description: getPointDescription(award.type),
            relatedId: reservationId,
            relatedModel: 'Reservation',
            balanceAfter: user.loyaltyPoints
        });
    }

    // Update tier
    user.loyaltyTier = getTierFromPoints(user.loyaltyPoints).name;

    await user.save();

    return { pointsAwarded, pointsBreakdown: pointsToAward };
};

// Get all reservations (filtered by role)
export const getAllReservations = async (req, res) => {
    try {
        let query = {};

        // Role-based filtering
        if (req.user.role === 'user') {
            query.userId = req.user._id;
        } else if (req.user.role === 'restaurant_manager') {
            const restaurant = await Restaurant.findOne({ managerId: req.user._id });
            if (restaurant) {
                query.restaurantId = restaurant._id;
            } else {
                return res.json([]);
            }
        }
        // super_admin can see all reservations

        const { status, date, restaurantId } = req.query;

        if (status) query.status = status;
        if (restaurantId) query.restaurantId = restaurantId;
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.date = { $gte: startDate, $lt: endDate };
        }

        const reservations = await Reservation.find(query)
            .populate('userId', 'name email')
            .populate('restaurantId', 'name location')
            .sort({ date: -1, time: 1 });

        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create reservation (user)
export const createReservation = async (req, res) => {
    try {
        const { restaurantId, date, time, partySize, specialRequests, contactPhone } = req.body;

        // Check if restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Check table availability
        const existingReservation = await Reservation.findOne({
            restaurantId,
            date: new Date(date),
            time,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (existingReservation) {
            return res.status(400).json({ message: 'Table not available at this time' });
        }

        const reservation = new Reservation({
            userId: req.user._id,
            restaurantId,
            date,
            time,
            partySize,
            specialRequests,
            contactPhone
        });

        await reservation.save();

        const populatedReservation = await Reservation.findById(reservation._id)
            .populate('userId', 'name email')
            .populate('restaurantId', 'name location');

        res.status(201).json(populatedReservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update reservation status (restaurant_manager or super_admin)
export const updateReservationStatus = async (req, res) => {
    try {
        const { status, tableNumber } = req.body;

        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // For restaurant managers, check ownership
        if (req.user.role === 'restaurant_manager') {
            const restaurant = await Restaurant.findOne({ managerId: req.user._id });
            if (!restaurant || restaurant._id.toString() !== reservation.restaurantId.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this reservation' });
            }
        }

        const previousStatus = reservation.status;
        reservation.status = status;
        if (tableNumber) reservation.tableNumber = tableNumber;

        await reservation.save();

        // Award loyalty points when reservation is completed
        if (status === 'completed' && previousStatus !== 'completed') {
            const loyaltyResult = await awardReservationPoints(reservation.userId, reservation._id);

            if (loyaltyResult && loyaltyResult.pointsAwarded > 0) {
                return res.json({
                    ...reservation.toObject(),
                    loyaltyPointsAwarded: loyaltyResult.pointsAwarded,
                    loyaltyBreakdown: loyaltyResult.pointsBreakdown
                });
            }
        }

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel reservation (user who made it, or restaurant_manager, or super_admin)
export const cancelReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Check authorization
        const isOwner = reservation.userId.toString() === req.user._id.toString();
        const isManager = req.user.role === 'restaurant_manager';
        const isAdmin = req.user.role === 'super_admin';

        if (!isOwner && !isManager && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
        }

        reservation.status = 'cancelled';
        await reservation.save();

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update/modify reservation (user who made it)
export const updateReservation = async (req, res) => {
    try {
        const { date, time, partySize, specialRequests, contactPhone } = req.body;

        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Check authorization - only the owner can modify their reservation
        const isOwner = reservation.userId.toString() === req.user._id.toString();

        if (!isOwner) {
            return res.status(403).json({ message: 'Not authorized to modify this reservation' });
        }

        // Only allow modification for pending or confirmed reservations
        if (reservation.status !== 'pending' && reservation.status !== 'confirmed') {
            return res.status(400).json({ message: 'Cannot modify a reservation that is not pending or confirmed' });
        }

        // Check if trying to change date or time - need to check availability
        if (date || time) {
            const newDate = date ? new Date(date) : reservation.date;
            const newTime = time || reservation.time;

            // Check table availability excluding current reservation
            const existingReservation = await Reservation.findOne({
                restaurantId: reservation.restaurantId,
                date: newDate,
                time: newTime,
                status: { $in: ['pending', 'confirmed'] },
                _id: { $ne: reservation._id }
            });

            if (existingReservation) {
                return res.status(400).json({ message: 'Table not available at this new date/time' });
            }
        }

        // Update fields if provided
        if (date) reservation.date = new Date(date);
        if (time) reservation.time = time;
        if (partySize) reservation.partySize = partySize;
        if (specialRequests !== undefined) reservation.specialRequests = specialRequests;
        if (contactPhone !== undefined) reservation.contactPhone = contactPhone;

        await reservation.save();

        const updatedReservation = await Reservation.findById(reservation._id)
            .populate('userId', 'name email')
            .populate('restaurantId', 'name location');

        res.json(updatedReservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete reservation (super_admin only)
export const deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
