import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getRecommendedRoommates } from '../controllers/roommateController.js';

const router = express.Router();

router.get('/recommendations', protect, getRecommendedRoommates);

export default router;
