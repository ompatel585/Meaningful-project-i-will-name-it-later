import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import mongoose from 'mongoose';

// Import routes
import authRoutes from './routes/auth.js';
import restaurantRoutes from './routes/restaurants.js';
import reservationRoutes from './routes/reservations.js';
import userRoutes from './routes/users.js';
import applicationRoutes from './routes/applications.js';
import reviewRoutes from './routes/reviews.js';
import adminRoutes from './routes/admin.js';
import ownerRoutes from './routes/owner.js';
import userRoutesExtra from './routes/userRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGOURI;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

connectDB();

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Restaurant Reservation API',
        status: 'Running',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        status: 'healthy',
        database: dbState
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/user', userRoutesExtra);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
