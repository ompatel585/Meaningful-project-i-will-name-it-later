import express from 'express';
import {
    getLoyaltyInfo,
    getLoyaltyTransactions,
    getAchievements,
    useReferralCode,
    generateReferralCode
} from '../controllers/loyaltyController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getLoyaltyInfo);
router.get('/transactions', authenticate, getLoyaltyTransactions);
router.get('/achievements', authenticate, getAchievements);
router.post('/referral', authenticate, useReferralCode);
router.post('/generate-referral-code', authenticate, generateReferralCode);

export default router;
