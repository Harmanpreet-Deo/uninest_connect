import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../config/multerConfig.js';
import {
    createProduct,
    getAllProducts,
    getUserProducts,
    updateProduct,
    updateProductSoldStatus,
    deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

router.post('/create', protect, upload.array('images', 5), createProduct);
router.get('/', getAllProducts);
router.put('/:id', protect, upload.array('images', 5), updateProduct);
router.get('/me', protect, getUserProducts);
router.delete('/:id', protect, deleteProduct);
router.patch('/:id/sold', protect, updateProductSoldStatus);


export default router;
