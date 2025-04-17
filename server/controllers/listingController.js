import Listing from '../models/Listing.js';
import cloudinary from '../config/cloudinaryConfig.js';

// ✅ CREATE Listing
export const createListing = async (req, res) => {
    try {
        const userId = req.user.id;

        const uploadedImages = [];
        if (req.files?.length) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'uninest/listings'
                });
                uploadedImages.push({ url: result.secure_url, public_id: result.public_id });
            }
        }


        if (uploadedImages.length === 0) {
            return res.status(400).json({ message: 'At least one image is required for your listing.' });
        }

        const newListing = new Listing({
            ...req.body,
            user: userId,
            images: uploadedImages,
            utilities: Array.isArray(req.body.utilities) ? req.body.utilities : [req.body.utilities],
        });

        await newListing.save();
        res.status(201).json(newListing);
    } catch (err) {
        console.error('Error creating listing:', err);
        res.status(500).json({ message: 'Failed to create listing', error: err.message });
    }
};


// ✅ GET My Listing
export const getMyListing = async (req, res) => {
    try {
        const listing = await Listing.findOne({ user: req.user.id });
        if (!listing) return res.status(404).json({ message: 'No listing found' });
        res.status(200).json(listing);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching listing', error: err.message });
    }
};

// ✅ UPDATE Listing (Full Throttle 🚀)
export const updateListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return res.status(404).json({ message: 'Listing not found' });

        if (listing.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this listing' });
        }

        listing.title = req.body.title || listing.title;
        listing.description = req.body.description || listing.description;
        listing.rent = req.body.rent || listing.rent;
        listing.location = req.body.location || listing.location;
        listing.availabilityDate = req.body.availabilityDate || listing.availabilityDate;
        listing.furnished = req.body.furnished === 'true' || req.body.furnished === true;

        if (req.body.utilities) {
            listing.utilities = Array.isArray(req.body.utilities)
                ? req.body.utilities
                : [req.body.utilities];
        }

        const keepUrls = Array.isArray(req.body.existingImages)
            ? req.body.existingImages
            : req.body.existingImages
                ? [req.body.existingImages]
                : [];

        const removedImages = listing.images.filter(img => !keepUrls.includes(img.url));
        for (let img of removedImages) {
            if (img.public_id) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        }

        const retainedImages = listing.images.filter(img => keepUrls.includes(img.url));

        let newImages = [];
        if (req.files?.length) {
            const uploadPromises = req.files.map(file =>
                cloudinary.uploader.upload(file.path, { folder: 'uninest/listings' })
            );
            const results = await Promise.all(uploadPromises);
            newImages = results.map(res => ({
                url: res.secure_url,
                public_id: res.public_id
            }));
        }

        listing.images = [...retainedImages, ...newImages];

        if (listing.images.length === 0) {
            return res.status(400).json({ message: 'At least one image is required for your listing.' });
        }

        await listing.save();
        res.status(200).json(listing);
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


// ✅ DELETE Listing
export const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findOne({ user: req.user.id });
        if (!listing) return res.status(404).json({ message: 'Listing not found' });

        // ❌ Delete all Cloudinary images first
        for (let img of listing.images) {
            if (img.public_id) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        }

        await Listing.deleteOne({ _id: listing._id });
        res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting listing', error: err.message });
    }
};

export const renewListing = async (req, res) => {
    try {
        const listing = await Listing.findOne({ user: req.user.id });
        if (!listing) return res.status(404).json({ message: 'No listing found' });

        listing.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await listing.save();

        res.status(200).json({ message: 'Listing renewed', expiresAt: listing.expiresAt });
    } catch (err) {
        res.status(500).json({ message: 'Failed to renew listing', error: err.message });
    }
};

// ✅ GET ALL Listings (Public, with optional filters)
export const getAllListings = async (req, res) => {
    try {
        const { location, minRent, maxRent, furnished, keyword } = req.query;

        let query = {};

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        if (furnished !== undefined) {
            query.furnished = furnished === 'true';
        }

        if (minRent || maxRent) {
            query.rent = {};
            if (minRent) query.rent.$gte = Number(minRent);
            if (maxRent) query.rent.$lte = Number(maxRent);
        }

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { location: { $regex: keyword, $options: 'i' } }
            ];
        }

        const listings = await Listing.find(query)
            .populate('user', 'fullName profilePicture email isVerified')
            .sort({ updatedAt: -1 });

        res.status(200).json(listings);
    } catch (err) {
        console.error('Error fetching listings:', err);
        res.status(500).json({ message: 'Failed to fetch listings', error: err.message });
    }
};
