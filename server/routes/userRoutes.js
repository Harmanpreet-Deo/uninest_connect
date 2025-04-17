import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../config/multerConfig.js';
import {
    createProfileWithPhoto,
    updateProfile,
    likeUserProfile,
    getUserById,
    getLikedProfiles,
    toggleSaveProduct,
    getSavedProducts,
    toggleSaveListing,
    getSavedListings,
    resetPassword,
    createRequest,
    verifyProfileRequest,
    verifyListingRequest,
    getMyRequests,
    validatePassword,
    cancelDeleteRequest
} from '../controllers/userController.js';




const router = express.Router();

router.patch('/create', protect, upload.single('profilePicture'), createProfileWithPhoto);
router.put('/update', protect, updateProfile);
router.post('/upload-photo', protect, upload.single('profilePicture'), createProfileWithPhoto);
router.patch('/like/:id', protect, likeUserProfile);
router.get('/liked', protect, getLikedProfiles);       // ✅ must come before
router.patch('/products/save/:id', protect, toggleSaveProduct);
router.patch('/save-listing/:id', protect, toggleSaveListing);
router.get('/products/saved', protect, getSavedProducts);
router.get('/listings/saved', protect, getSavedListings);
router.patch('/reset-password', protect, resetPassword);
router.get('/requests/mine', protect, getMyRequests);
router.post('/validate-password', protect, validatePassword);
router.delete('/cancel-delete-request', protect, cancelDeleteRequest);



router.get('/:id', getUserById);
// 👈 generic route should be last


router.post('/requests',
    protect,
    upload.fields([
        { name: 'document', maxCount: 1 },
        { name: 'idFront', maxCount: 1 },
        { name: 'idBack', maxCount: 1 }
    ]),
    createRequest
);

// POST: Verify Listing (PDF)
router.post('/request/verify-listing', protect, upload.single('document'), verifyListingRequest);

// POST: Verify Profile (Two images)
router.post('/request/verify-profile', protect, upload.fields([
    { name: 'idFront', maxCount: 1 },
    { name: 'idBack', maxCount: 1 }
]), verifyProfileRequest);


export default router;
