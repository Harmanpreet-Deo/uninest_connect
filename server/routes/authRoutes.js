import express from 'express';
import {
    sendOtp,
    verifyOtp,
    register,
    login,
    logout,
    completeProfile,
    getUserProfile,
    validateLoginCredentials,
    resetPasswordHandler,
    sendResetOtp
} from '../controllers/authController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/prelogin', validateLoginCredentials); // ✅ New

router.post('/send-otp', sendOtp);
router.post('/send-reset-otp', sendResetOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.patch('/complete-profile', protect, completeProfile);
router.get('/me', protect, getUserProfile);
router.patch('/reset-password', resetPasswordHandler);

export default router;
