import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 1000
    },
    category: {
        type: String,
        enum: [
            'Electronics', 'Books', 'Furniture', 'Clothing', 'Appliances',
            'Sports', 'Toys', 'Tools', 'Automotive', 'Home Decor',
            'Health & Beauty', 'Office Supplies', 'Musical Instruments', 'Garden',
            'Art & Craft', 'Pet Supplies', 'Footwear', 'Jewelry', 'Other'
        ],
        required: true
    },
    condition: {
        type: String,
        enum: ['new', 'used'],
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0.01
    },
    images: {
        type: [String], // Cloudinary URLs
        default: []
    },
    isSold: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('Product', productSchema);
