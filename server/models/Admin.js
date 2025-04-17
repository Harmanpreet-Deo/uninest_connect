import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
    role: {
        type: String,
        enum: ['admin', 'superadmin'],
        default: 'admin'
    }
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model('Admin', adminSchema);
