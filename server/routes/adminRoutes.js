import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import {
    adminLogin,
    adminLogout,
    getAllRequests,
    updateRequestStatus,
    adminDeleteEntity,
    getProductById,
    getUserById,
    getListingById
} from '../controllers/adminController.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);

// ✅ Fix: protect must come before isAdmin
router.post('/logout', protect, isAdmin, adminLogout);

// Protected routes
router.get('/requests', protect, isAdmin, getAllRequests);
router.patch('/requests/:id/status', protect, isAdmin, updateRequestStatus);
router.delete('/delete/:type/:id', protect, isAdmin, adminDeleteEntity);
// in adminRoutes.js
router.get('/user/:id', protect, isAdmin, getUserById);
router.get('/product/:id', protect, isAdmin, getProductById);
router.get('/listing/:id', protect, isAdmin, getListingById);


export default router;
