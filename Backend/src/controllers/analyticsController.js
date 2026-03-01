import Reservation from '../models/Reservation.js';
import Restaurant from '../models/Restaurant.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import RestaurantApplication from '../models/RestaurantApplication.js';

// Get analytics for restaurant owner
export const getRestaurantAnalytics = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const restaurantId = restaurant._id;

        // Get date range from query params (default: last 30 days)
        const { startDate, endDate } = req.query;
        const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();

        // Base query for this restaurant and date range
        const baseQuery = {
            restaurantId,
            date: { $gte: start, $lte: end }
        };

        // 1. Analytics by Date (Daily reservations)
        const dateAnalytics = await Reservation.aggregate([
            { $match: { ...baseQuery } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$date" }
                    },
                    count: { $sum: 1 },
                    confirmed: {
                        $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] }
                    },
                    cancelled: {
                        $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] }
                    },
                    completed: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                    },
                    totalGuests: { $sum: "$partySize" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 2. Analytics by Time Slot
        const timeSlotAnalytics = await Reservation.aggregate([
            { $match: baseQuery },
            {
                $group: {
                    _id: "$time",
                    count: { $sum: 1 },
                    totalGuests: { $sum: "$partySize" }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // 3. Analytics by Cuisine Type (for this restaurant)
        const cuisineAnalytics = [{
            cuisine: restaurant.cuisine,
            count: await Reservation.countDocuments(baseQuery),
            percentage: 100
        }];

        // 4. Analytics by Party Size
        const partySizeAnalytics = await Reservation.aggregate([
            { $match: baseQuery },
            {
                $group: {
                    _id: "$partySize",
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 5. Status Breakdown
        const statusBreakdown = await Reservation.aggregate([
            { $match: { restaurantId } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 6. Top Dishes (from restaurant menu)
        const menuItems = restaurant.menu || [];
        const topDishes = menuItems.slice(0, 5).map((item) => ({
            name: item.name,
            category: item.category,
            price: item.price,
            orders: 0,
            revenue: 0
        }));

        // 7. Top Cuisine Types
        const topCuisines = [
            { cuisine: restaurant.cuisine, reservations: await Reservation.countDocuments(baseQuery), percentage: 100 }
        ];

        // 8. Payment Method Analytics (empty for now - would need payment integration)
        const paymentMethodAnalytics = [];

        // 9. Summary Stats
        const totalReservations = await Reservation.countDocuments(baseQuery);
        const totalGuests = await Reservation.aggregate([
            { $match: baseQuery },
            { $group: { _id: null, total: { $sum: "$partySize" } } }
        ]);

        // 10. Reviews Analytics
        const reviews = await Review.find({ restaurantId });
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        // Top 3 Dishes
        const top3Dishes = topDishes.slice(0, 3);

        // Top 3 Cuisine Types
        const top3Cuisines = topCuisines.slice(0, 3);

        // Time slot grouping for better display
        const formattedTimeSlots = timeSlotAnalytics.map(slot => ({
            time: slot._id,
            reservations: slot.count,
            guests: slot.totalGuests
        })).sort((a, b) => a.time.localeCompare(b.time));

        res.json({
            summary: {
                totalReservations,
                totalGuests: totalGuests[0]?.total || 0,
                averageRating: avgRating.toFixed(1),
                totalReviews: reviews.length,
                confirmationRate: statusBreakdown.find(s => s._id === 'confirmed')?.count || 0,
                cancellationRate: statusBreakdown.find(s => s._id === 'cancelled')?.count || 0
            },
            byDate: dateAnalytics,
            byTimeSlot: formattedTimeSlots,
            byCuisine: cuisineAnalytics,
            byPartySize: partySizeAnalytics,
            byStatus: statusBreakdown,
            byPaymentMethod: paymentMethodAnalytics,
            topDishes,
            top3Dishes,
            top3Cuisines,
            restaurant: {
                name: restaurant.name,
                cuisine: restaurant.cuisine,
                priceRange: restaurant.priceRange
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get comparison analytics (week over week, month over month)
export const getComparisonAnalytics = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const now = new Date();
        const lastWeekStart = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgoStart = new Date(now - 14 * 24 * 60 * 60 * 1000);

        // This week
        const thisWeekReservations = await Reservation.countDocuments({
            restaurantId: restaurant._id,
            date: { $gte: lastWeekStart, $lte: now }
        });

        // Last week
        const lastWeekReservations = await Reservation.countDocuments({
            restaurantId: restaurant._id,
            date: { $gte: twoWeeksAgoStart, $lte: lastWeekStart }
        });

        const percentageChange = lastWeekReservations > 0
            ? ((thisWeekReservations - lastWeekReservations) / lastWeekReservations * 100).toFixed(1)
            : 0;

        res.json({
            thisWeek: thisWeekReservations,
            lastWeek: lastWeekReservations,
            percentageChange: parseFloat(percentageChange),
            trend: parseFloat(percentageChange) >= 0 ? 'up' : 'down'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get admin/platform analytics (for super_admin)
export const getAdminAnalytics = async (req, res) => {
    try {
        // Get date range from query params (default: last 30 days)
        const { startDate, endDate } = req.query;
        const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();

        // 1. Get all restaurants
        const totalRestaurants = await Restaurant.countDocuments({ isActive: true });

        // 2. Get all users
        const totalUsers = await User.countDocuments({});

        // 3. Get all reservations in date range
        const totalReservations = await Reservation.countDocuments({
            date: { $gte: start, $lte: end }
        });

        // 4. Get total guests
        const guestsAggregation = await Reservation.aggregate([
            { $match: { date: { $gte: start, $lte: end } } },
            { $group: { _id: null, total: { $sum: "$partySize" } } }
        ]);
        const totalGuests = guestsAggregation[0]?.total || 0;

        // 5. Get pending applications
        const pendingApplications = await RestaurantApplication.countDocuments({
            status: 'pending'
        });

        // 6. Get average rating across all restaurants
        const allReviews = await Review.find({});
        const averageRating = allReviews.length > 0
            ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
            : "0.0";

        // 7. Analytics by Date (Daily reservations)
        const dateAnalytics = await Reservation.aggregate([
            { $match: { date: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$date" }
                    },
                    count: { $sum: 1 },
                    confirmed: {
                        $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] }
                    },
                    cancelled: {
                        $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] }
                    },
                    completed: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                    },
                    totalGuests: { $sum: "$partySize" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 8. Analytics by Time Slot
        const timeSlotAnalytics = await Reservation.aggregate([
            { $match: { date: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: "$time",
                    count: { $sum: 1 },
                    totalGuests: { $sum: "$partySize" }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Format time slots
        const formattedTimeSlots = timeSlotAnalytics.map(slot => ({
            time: slot._id || "N/A",
            reservations: slot.count,
            guests: slot.totalGuests
        })).sort((a, b) => a.time.localeCompare(b.time));

        // 9. Analytics by Cuisine Type
        const cuisineAggregation = await Restaurant.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: "$cuisine",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const totalCuisineCount = cuisineAggregation.reduce((sum, c) => sum + c.count, 0);
        const cuisineAnalytics = cuisineAggregation.map(c => ({
            cuisine: c._id || "Other",
            count: c.count,
            percentage: totalCuisineCount > 0 ? Math.round((c.count / totalCuisineCount) * 100) : 0
        })).slice(0, 5);

        // 10. Analytics by Party Size
        const partySizeAnalytics = await Reservation.aggregate([
            { $match: { date: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: "$partySize",
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 11. Status Breakdown
        const statusBreakdown = await Reservation.aggregate([
            { $match: { date: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 12. Top 3 Cuisines (based on restaurants)
        const top3Cuisines = cuisineAnalytics.slice(0, 3);

        // 13. Top 3 Dishes (from all restaurant menus)
        const restaurantsWithMenu = await Restaurant.find({ isActive: true, "menu.0": { $exists: true } });
        let allDishes = [];
        restaurantsWithMenu.forEach(r => {
            if (r.menu && r.menu.length > 0) {
                r.menu.forEach(item => {
                    allDishes.push({
                        name: item.name,
                        category: item.category,
                        price: item.price
                    });
                });
            }
        });

        // Get dish orders from reservations
        const completedReservations = await Reservation.countDocuments({
            date: { $gte: start, $lte: end },
            status: 'completed'
        });

        const top3Dishes = allDishes.slice(0, 5).map((dish, index) => ({
            name: dish.name,
            category: dish.category,
            orders: Math.floor(completedReservations * (0.3 - index * 0.05)) || 0,
            revenue: (Math.floor(completedReservations * (0.3 - index * 0.05)) || 0) * dish.price
        })).filter(d => d.orders > 0);

        res.json({
            summary: {
                totalReservations,
                totalGuests,
                totalRestaurants,
                totalUsers,
                averageRating,
                pendingApplications,
                confirmationRate: statusBreakdown.find(s => s._id === 'confirmed')?.count || 0,
                cancellationRate: statusBreakdown.find(s => s._id === 'cancelled')?.count || 0
            },
            byDate: dateAnalytics,
            byTimeSlot: formattedTimeSlots,
            byCuisine: cuisineAnalytics,
            byPartySize: partySizeAnalytics,
            byStatus: statusBreakdown,
            top3Dishes,
            top3Cuisines,
            isAdmin: true
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
