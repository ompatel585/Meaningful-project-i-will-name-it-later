import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGOURI || 'mongodb://localhost:27017/myapp';

// Middleware
app.use(cors());
app.use(express.json());

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
        message: 'Welcome to Backend API',
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

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
