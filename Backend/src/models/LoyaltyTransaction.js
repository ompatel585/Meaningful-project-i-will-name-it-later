import mongoose from 'mongoose';

const loyaltyTransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: [
            'WELCOME_BONUS',
            'FIRST_RESERVATION',
            'PER_RESERVATION',
            'FIRST_REVIEW',
            'ADD_FAVORITE',
            'PROFILE_COMPLETION',
            'THREE_MONTH_STREAK',
            'REFERRAL',
            'MILESTONE_5',
            'MILESTONE_10',
            'MILESTONE_25',
            'MILESTONE_50',
            'FIRST_YEAR_COMPLETED',
            'FIRST_YEAR_MONTHLY',
            'POINTS_REDEEMED'
        ],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'relatedModel',
        default: null
    },
    relatedModel: {
        type: String,
        enum: ['Reservation', 'Review', 'User', null],
        default: null
    },
    balanceAfter: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Index for faster queries
loyaltyTransactionSchema.index({ userId: 1, createdAt: -1 });
loyaltyTransactionSchema.index({ userId: 1, type: 1 });

const LoyaltyTransaction = mongoose.model('LoyaltyTransaction', loyaltyTransactionSchema);

export default LoyaltyTransaction;
