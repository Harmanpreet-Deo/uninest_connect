import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return jwt.sign({
        id: user._id,
        fullName: user.fullName, // ✅ include this
        email: user.email,
        isProfileComplete: user.isProfileComplete,
        isVerified: user.isVerified || false
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
