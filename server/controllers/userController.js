import cloudinary from '../config/cloudinaryConfig.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import Request from '../models/Request.js';

import path from 'path';

export const createProfileWithPhoto = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            gender,
            dob,
            budget,
            campus,
            pets,
            year,
            bio
        } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        let profilePicUrl = user.profilePicture;

        // If a new photo is uploaded, upload to Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            profilePicUrl = result.secure_url;
        }

        // Update fields
        user.profilePicture = profilePicUrl;
        user.gender = gender;
        user.dob = dob;
        user.budget = budget;
        user.campus = campus;
        user.pets = pets;
        user.year = year;
        user.bio = bio;
        user.isProfileComplete = true;

        await user.save();

        // Remove password from response
        const sanitizedUser = user.toObject();
        delete sanitizedUser.password;

        res.status(200).json(sanitizedUser); // ✅ return updated user including profilePicture
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Profile creation failed', error: err.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
            new: true,
        }).select('-password'); // Exclude password

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update profile', error: err.message });
    }
};


// ✅ Update likeUserProfile to toggle
export const likeUserProfile = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const likedUserId = req.params.id;

        if (!currentUser) return res.status(404).json({ message: 'User not found' });
        if (likedUserId === currentUser._id.toString()) {
            return res.status(400).json({ message: 'You cannot like your own profile' });
        }

        const index = currentUser.likedProfiles.indexOf(likedUserId);
        let message = '';

        if (index === -1) {
            currentUser.likedProfiles.push(likedUserId);
            message = 'Profile liked';
        } else {
            currentUser.likedProfiles.splice(index, 1);
            message = 'Profile unliked';
        }

        await currentUser.save();
        res.status(200).json({ message });
    } catch (err) {
        console.error('Error liking/unliking user:', err);
        res.status(500).json({ message: 'Failed to update like status' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};



export const toggleSaveProduct = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const productId = req.params.id;

        if (!user) return res.status(404).json({ message: 'User not found' });

        const index = user.savedProducts.indexOf(productId);
        let action = '';

        if (index === -1) {
            user.savedProducts.push(productId);
            action = 'saved';
        } else {
            user.savedProducts.splice(index, 1);
            action = 'unsaved';
        }

        await user.save();
        res.status(200).json({ message: `Product ${action}` });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update saved products', error: err.message });
    }
};



// PATCH /user/save-listing/:id
export const toggleSaveListing = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const listingId = req.params.id;

        if (!user) return res.status(404).json({ message: 'User not found' });

        const index = user.savedListings.indexOf(listingId);
        if (index !== -1) {
            user.savedListings.splice(index, 1); // Remove
        } else {
            user.savedListings.push(listingId); // Save
        }

        await user.save();
        res.status(200).json({ savedListings: user.savedListings });
    } catch (err) {
        res.status(500).json({ message: 'Toggle failed', error: err.message });
    }
};


export const getLikedProfiles = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id)
            .populate('likedProfiles', '-password -otp -otpExpiry');

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const validProfiles = currentUser.likedProfiles.filter(profile => profile !== null);
        res.status(200).json(validProfiles);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getSavedProducts = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'savedProducts',
            populate: { path: 'user', select: 'fullName email isVerified' }
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const validProducts = user.savedProducts.filter(product => product !== null);
        res.status(200).json(validProducts);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch saved products', error: err.message });
    }
};

export const getSavedListings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'savedListings',
            populate: { path: 'user', select: 'fullName isVerified email' }
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const validListings = user.savedListings.filter(listing => listing !== null);
        res.status(200).json(validListings);
    } catch (err) {
        console.error('Error fetching saved listings:', err);
        res.status(500).json({ message: 'Failed to fetch saved listings', error: err.message });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const { currentPassword, newPassword } = req.body;

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Incorrect current password' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const createRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            type,
            title,
            message,
            targetUser,
            targetProduct,
            targetListing
        } = req.body;

        const newRequest = new Request({
            user: userId,
            type,
            title,
            message,
            targetUser,
            targetProduct,
            targetListing
        });

        // ✅ Upload optional document (for reports, support, etc.)
        if (req.files?.document?.[0]) {
            const uploaded = await cloudinary.uploader.upload(req.files.document[0].path, {
                folder: 'uninest/support-or-report',
                resource_type: 'auto'
            });
            newRequest.document = {
                url: uploaded.secure_url,
                public_id: uploaded.public_id
            };
        }

        // ✅ Upload optional ID front/back for profile verification-style requests
        if (req.files?.idFront?.[0] && req.files?.idBack?.[0]) {
            const front = await cloudinary.uploader.upload(req.files.idFront[0].path, {
                folder: 'uninest/verify-id'
            });

            const back = await cloudinary.uploader.upload(req.files.idBack[0].path, {
                folder: 'uninest/verify-id'
            });

            newRequest.idPhotos = {
                front: front.secure_url,
                back: back.secure_url
            };
        }

        await newRequest.save();
        res.status(201).json({ message: 'Request submitted', request: newRequest });
    } catch (err) {
        res.status(500).json({ message: 'Failed to submit request', error: err.message });
    }
};



export const verifyProfileRequest = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.files?.idFront || !req.files?.idBack) {
            return res.status(400).json({ message: 'Both front and back ID images are required' });
        }

        const front = await cloudinary.uploader.upload(req.files.idFront[0].path, {
            folder: 'uninest/verify-id'
        });

        const back = await cloudinary.uploader.upload(req.files.idBack[0].path, {
            folder: 'uninest/verify-id'
        });

        const request = new Request({
            user: userId,
            type: 'verify_profile',
            message: 'Requesting profile verification',
            idPhotos: {
                front: front.secure_url,
                back: back.secure_url,
            }
        });

        await request.save();
        res.status(201).json({ message: 'Profile verification request submitted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to submit request', error: err.message });
    }
};


export const verifyListingRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'Document required' });
        }

        const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: 'uninest/verify-listing',
            resource_type: 'auto',
            public_id: `listing_${Date.now()}` // ✅ FIX: no file extension
        });

        const request = new Request({
            user: userId,
            type: 'verify_listing',
            message: 'Requesting listing verification',
            document: {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id
            },
            targetListing: req.body.listingId || undefined
        });

        await request.save();
        res.status(201).json({ message: 'Listing verification request submitted' });
    } catch (err) {
        console.error('verifyListingRequest error:', err);
        res.status(500).json({ message: 'Failed to submit request', error: err.message });
    }
};




// controllers/userController.js
export const getMyRequests = async (req, res) => {
    try {
        const requests = await Request.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch requests', error: err.message });
    }
};


export const validatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Incorrect password' });

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Validation failed', error: err.message });
    }
};

export const cancelDeleteRequest = async (req, res) => {
    try {
        const request = await Request.findOne({
            user: req.user.id,
            type: 'delete_account',
            status: 'pending'
        });

        if (!request) {
            return res.status(404).json({ message: 'No pending delete request found.' });
        }

        await request.deleteOne();
        res.status(200).json({ message: 'Delete request canceled.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to cancel request', error: err.message });
    }
};