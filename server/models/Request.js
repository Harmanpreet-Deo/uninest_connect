import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: [
            'support',
            'verify_listing',
            'verify_profile',
            'delete_account',
            'report_user',
            'report_product',
            'report_listing'
        ],
        required: true
    },
    title: { type: String }, // For support requests
    message: { type: String },

    // ✅ Single document for listing verification (PDF, etc.)
    document: {
        url: String,
        public_id: String
    },

    // ✅ For profile verification (ID front/back images)
    idPhotos: {
        front: String,
        back: String
    },

    // Reporting Targets
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    targetListing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },

    status: { type: String, enum: ['pending', 'resolved', 'dismissed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Request', requestSchema);
