import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Request from '../models/Request.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Listing from '../models/Listing.js';

// ✅ Admin Login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '2d' });
        res.status(200).json({ token, admin: { fullName: admin.fullName, email: admin.email, role: admin.role } });
    } catch (err) {
        res.status(500).json({ message: 'Admin login failed', error: err.message });
    }
};


export const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find()
            .populate('user', 'fullName email isVerified')
            .populate('targetUser', 'fullName email isVerified')
            .populate('targetProduct', 'title')
            .populate('targetListing', 'title');

        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch requests', error: err.message });
    }
};



export const updateRequestStatus = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const { status } = req.body;

        // Update request status
        request.status = status;
        await request.save();

        // ✅ If approved, update related entity
        if (status === 'resolved') {
            if (request.type === 'verify_profile') {
                const user = await User.findById(request.user);
                if (user) {
                    user.isVerified = true;
                    await user.save();
                }
            }

            if (request.type === 'verify_listing') {
                const listingId = request.targetListing;
                if (listingId) {
                    const Listing = (await import('../models/listing.js')).default;
                    const listing = await Listing.findById(listingId);
                    if (listing) {
                        listing.isVerified = true;
                        await listing.save();
                    }
                }
            }
        }

        res.status(200).json({ message: 'Request updated', request });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update status', error: err.message });
    }
};


export const adminDeleteEntity = async (req, res) => {
    const { type, id } = req.params;

    try {
        let deleted = null;

        if (type === 'user') deleted = await User.findByIdAndDelete(id);
        else if (type === 'product') deleted = await Product.findByIdAndDelete(id);
        else if (type === 'listing') deleted = await Listing.findByIdAndDelete(id);
        else return res.status(400).json({ message: 'Invalid type' });

        if (!deleted) return res.status(404).json({ message: 'Item not found' });

        res.status(200).json({ message: `${type} deleted successfully` });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete item', error: err.message });
    }
};

export const adminLogout = async (req, res) => {
    try {
        console.log(`Admin ${req.user.id} logged out`);

        res.status(200).json({ message: 'Admin logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Logout failed', error: err.message });
    }
};


export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user', error: err.message });
    }
};


export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('user', 'fullName email');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch product', error: err.message });
    }
};


export const getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('user', 'fullName email');
        if (!listing) return res.status(404).json({ message: 'Listing not found' });
        res.status(200).json(listing);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch listing', error: err.message });
    }
};
