import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../config/multerConfig.js';
import {
    createListing,
    getMyListing,
    updateListing,
    deleteListing,
    renewListing,
    getAllListings,
} from '../controllers/listingController.js';

const router = express.Router();

router.get('/me', protect, getMyListing);

router.post('/', protect, upload.array('images', 5), createListing);

router.put('/:id', protect, upload.array('images', 5), updateListing);

router.delete('/:id', protect, deleteListing);

router.patch('/renew', protect, renewListing);

router.get('/', getAllListings);



export default router;
