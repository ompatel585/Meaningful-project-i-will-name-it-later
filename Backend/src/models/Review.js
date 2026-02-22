import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    response: {
        text: String,
        respondedAt: Date,
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    images: [{
        type: String
    }],
    visitDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient queries
reviewSchema.index({ restaurantId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
