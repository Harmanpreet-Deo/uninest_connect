import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';

// OTP GENERATION
export const sendOtp = async (req, res) => {
    const { email, mode } = req.body;
    console.log('OTP request:', email, mode);

    try {
        let user = await User.findOne({ email }); // ✅ use let

        if (mode === 'login') {
            if (!user || !user.password) {
                return res.status(400).json({ message: 'User does not exist or is not registered' });
            }
        }

        if (mode === 'register') {
            if (user && user.password) {
                return res.status(400).json({ message: 'User already registered' });
            }
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        if (!user) {
            user = new User({ email });
        }

        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;
        await user.save();

        res.status(200).json({ otp });
    } catch (err) {
        console.error('OTP Error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};


export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.status(200).json({ message: 'OTP verified' });
    } catch (err) {
        res.status(500).json({ message: 'OTP verification failed' });
    }
};

export const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Email not OTP verified' });
        if (user.password) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        await user.save();

        const token = generateToken(user);
        res.status(201).json({
            token,
            isProfileComplete: user.isProfileComplete
        });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed' });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !user.password) return res.status(400).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user);
        res.status(200).json({
            token,
            isProfileComplete: user.isProfileComplete,
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
        });
    } catch (err) {
        res.status(500).json({ message: 'Login failed' });
    }
};

// ✨ Add this function just above or below login()
export const validateLoginCredentials = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(400).json({ message: 'User does not exist or is not registered' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        return res.status(200).json({ message: 'Credentials valid' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};


export const logout = async (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' }); // JWT just needs to be deleted on frontend
};

export const completeProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isProfileComplete = true;
        await user.save();

        res.status(200).json({ message: 'Profile marked as complete' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update profile', error: err.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -otp -otpExpiry');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user', error: err.message });
    }
};

export const resetPasswordHandler = async (req, res) => {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp || user.otpExpiry) {
        return res.status(400).json({ message: 'OTP must be verified before resetting password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
};


// 🔁 Exact copy-style reset OTP version (isolated from login/register)
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    console.log('Reset OTP request:', email);

    try {
        let user = await User.findOne({ email }); // ✅ same pattern

        if (!user || !user.password) {
            return res.status(400).json({ message: 'User does not exist or is not registered' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('Generated reset OTP:', otp); // 🔍 match your logging

        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;
        await user.save();

        // ✅ send otp using email service here if needed
        // For now, just log
        console.log(`Sending password reset OTP to ${email}: ${otp}`);

        res.status(200).json({ otp }); // ⚠️ return only in dev
    } catch (err) {
        console.error('Reset OTP Error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

