import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, match: /@(?:student\.)?kpu\.ca$/},
    fullName: { type: String },
    password: { type: String },
    otp: { type: String },
    otpExpiry: { type: Date },
    profilePicture: { type: String },
    gender: String,
    dob: String,
    budget: Number,
    campus: String,
    pets: String,
    year: String,
    bio: String,
    status: { type: String, default: 'Looking for a Place to Rent' },
    isVerified: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    sleepSchedule: { type: String, default: null },
    socialPreference: { type: String, default: null },
    studyStyle: { type: String, default: null },
    foodPreference: { type: String, default: null },
    smoking: { type: Boolean, default: null },
    drinking: { type: Boolean, default: null },
    guestFriendly: { type: Boolean, default: null },
    hobbies: { type: String, default: '' },
    languagesSpoken: { type: String, default: '' },
    likedProfiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    savedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    savedListings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],

});

// ✅ Fix: prevent OverwriteModelError
export default mongoose.models.User || mongoose.model('User', userSchema);
