import Request from '../models/Request.js';
import User from '../models/User.js';

// ✅ Create a request
export const createRequest = async (req, res) => {
    try {
        const { type, message, targetUser, targetProduct, targetListing } = req.body;

        const newRequest = new Request({
            user: req.user.id,
            type,
            message,
            targetUser,
            targetProduct,
            targetListing
        });

        await newRequest.save();
        res.status(201).json({ message: 'Request submitted', request: newRequest });
    } catch (err) {
        res.status(500).json({ message: 'Failed to submit request', error: err.message });
    }
};

// ✅ Get all requests (Admin only)
export const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find()
            .populate('user', 'fullName email')
            .populate('targetUser', 'fullName email')
            .populate('targetProduct', 'title')
            .populate('targetListing', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch requests', error: err.message });
    }
};

// ✅ Update request status (resolve or dismiss)
export const updateRequestStatus = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        request.status = req.body.status;
        await request.save();

        res.status(200).json({ message: 'Request updated', request });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update request', error: err.message });
    }
};
