import express from 'express';
import {
    getRestaurantReviews,
    createReview,
    getOwnerReviews,
    respondToReview,
    deleteReview
} from '../controllers/reviewController.js';
import { auth, restaurantOwnerAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/restaurant/:restaurantId', getRestaurantReviews);
router.post('/', auth, createReview);
router.get('/owner/my-restaurant-reviews', auth, restaurantOwnerAuth, getOwnerReviews);
router.put('/:reviewId/respond', auth, restaurantOwnerAuth, respondToReview);
router.delete('/:reviewId', auth, deleteReview);

export default router;
