import Product from '../models/product.js';
import cloudinary from '../config/cloudinaryConfig.js';

// ✅ CREATE Product
export const createProduct = async (req, res) => {
    try {
        const userId = req.user.id;

        let uploadedImages = [];
        if (req.files?.length) {
            const uploadPromises = req.files.map(file =>
                cloudinary.uploader.upload(file.path, { folder: 'uninest/products' })
            );
            const results = await Promise.all(uploadPromises);
            uploadedImages = results.map(res => res.secure_url);
        }

        if (uploadedImages.length === 0) {
            return res.status(400).json({ message: 'At least one image is required for your product.' });
        }

        const newProduct = new Product({
            ...req.body,
            user: userId,
            images: uploadedImages,
            category: req.body.category,
            condition: req.body.condition,
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('Create product error:', err);
        const message =
            err.name === 'ValidationError'
                ? Object.values(err.errors)[0].message
                : 'Failed to create product';
        res.status(400).json({ message });
    }
};


// ✅ GET All Products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('user', 'fullName email isVerified');
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch products', error: err.message });
    }
};

// ✅ GET Products by User
export const getUserProducts = async (req, res) => {
    try {
        const products = await Product.find({ user: req.user.id });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user products', error: err.message });
    }
};

// ✅ DELETE Product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete product', error: err.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, user: req.user.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.title = req.body.title || product.title;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        product.category = req.body.category || product.category;
        product.condition = req.body.condition || product.condition;
        product.isSold = req.body.isSold ?? product.isSold;


        let existingImages = req.body.existingImages || [];
        if (typeof existingImages === 'string') {
            existingImages = [existingImages];
        }

        let newImages = [];
        if (req.files?.length) {
            const uploadPromises = req.files.map(file =>
                cloudinary.uploader.upload(file.path, { folder: 'uninest/products' })
            );
            const results = await Promise.all(uploadPromises);
            newImages = results.map(res => res.secure_url);
        }


        product.images = [...existingImages, ...newImages];

        if (product.images.length === 0) {
            return res.status(400).json({ message: 'At least one image is required for your product.' });
        }

        await product.save();
        res.status(200).json(product);
    } catch (err) {
        console.error('Update product error:', err);
        const message =
            err.name === 'ValidationError'
                ? Object.values(err.errors)[0].message
                : 'Failed to update product';
        res.status(400).json({ message });
    }
};

export const updateProductSoldStatus = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, user: req.user.id });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.isSold = req.body.isSold;
        await product.save();
        res.status(200).json({ message: 'Updated status', isSold: product.isSold });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update status', error: err.message });
    }
};

