import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import {
    getAllRestaurants,
    getRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getMyRestaurant,
    uploadImages,
    getCloudinaryImages,
    deleteImage
} from '../controllers/public/restaurantController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'restaurant-images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 1200, height: 800, crop: 'limit' }]
    }
});

const upload = multer({ storage: storage });

// Public routes
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurant);

// Upload images (public)
router.post('/upload-images', upload.array('images', 10), uploadImages);
router.get('/cloudinary/images', getCloudinaryImages);

// Protected routes
router.post(
    '/',
    authenticate,
    authorize('super_admin', 'restaurant_owner'),
    upload.array('images', 10),
    createRestaurant
);
router.put('/:id', authenticate, authorize('super_admin', 'restaurant_owner'), upload.array('images'), updateRestaurant);
router.delete('/:id', authenticate, authorize('super_admin'), deleteRestaurant);

// Owner routes
router.get('/owner/my-restaurant', authenticate, authorize('restaurant_owner'), getMyRestaurant);
router.delete('/delete-image', authenticate, authorize('restaurant_owner'), deleteImage);

export default router;
