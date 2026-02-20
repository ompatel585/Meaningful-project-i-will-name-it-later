import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    partySize: {
        type: Number,
        required: true,
        min: 1
    },
    tableNumber: {
        type: Number
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    specialRequests: {
        type: String
    },
    contactPhone: {
        type: String
    }
}, {
    timestamps: true
});

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
