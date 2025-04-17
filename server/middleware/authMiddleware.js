import jwt from 'jsonwebtoken';
import Admin from '../models/admin.js';

export const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('🔐 Decoded user from token:', decoded); // ✅ Add this
        req.user = decoded;
        next();
    } catch (err) {
        console.error('❌ Invalid token:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(403).json({message: 'Admin access only'});

        req.admin = admin;
        next();
    } catch (err) {
        res.status(500).json({message: 'Admin check failed', error: err.message});
    }
};