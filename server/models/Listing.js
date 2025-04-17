import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        minlength: 20,
    },
    rent: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    availabilityDate: {
        type: Date,
        required: true,
    },
    furnished: {
        type: Boolean,
        default: false,
    },
    utilities: {
        type: [String], // ✅ Similar to hobbies or languages
        default: [],
    },
    images: {
        type: [
            {
                url: String,
                public_id: String
            }
        ],
        default: [],
    },
    isVerified: {
        type: Boolean,
        default: false, // Future use
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    }

}, {
    timestamps: true // ✅ Adds createdAt and updatedAt fields
});

export default mongoose.model('Listing', listingSchema);

