import User from '../models/User.js';
import {
    calculateCosineSimilarity,
    generateUserVector
} from '../utils/matchUtils.js';

// 🔹 Truncate bios neatly
const truncateBio = (bio, maxLen = 120) => {
    if (!bio) return '';
    return bio.length <= maxLen ? bio : bio.slice(0, maxLen) + '...';
};

// 🔹 Compute average vector from multiple users
const calculateCentroid = (users) => {
    const allVectors = users.map(generateUserVector);
    const vectorLength = allVectors[0].length;
    const sum = Array(vectorLength).fill(0);

    for (let vec of allVectors) {
        for (let i = 0; i < vectorLength; i++) {
            sum[i] += vec[i];
        }
    }

    return sum.map((val) => val / users.length);
};

// ✅ Main recommendation logic
export const getRecommendedRoommates = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id).lean();
        if (!currentUser) return res.status(404).json({ message: 'User not found' });

        const likedProfiles = await User.find({
            _id: { $in: currentUser.likedProfiles }
        }).lean();

        const baseVector =
            likedProfiles.length >= 5
                ? calculateCentroid(likedProfiles)
                : generateUserVector(currentUser);

        const candidates = await User.find({
            _id: { $ne: currentUser._id, $nin: currentUser.likedProfiles },
            isProfileComplete: true
        }).lean();

        const results = candidates.map((candidate) => {
            const similarity = calculateCosineSimilarity(baseVector, generateUserVector(candidate));
            return {
                _id: candidate._id,
                fullName: candidate.fullName,
                profilePicture: candidate.profilePicture || '/default_profile.png',
                gender: candidate.gender,
                campus: candidate.campus,
                budget: candidate.budget,
                isVerified: candidate.isVerified,
                status: candidate.status,
                bio: truncateBio(candidate.bio),
                compatibilityScore: Math.round(similarity * 100)
            };
        });

        results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

        res.status(200).json({
            currentGender: currentUser.gender,
            recommendations: results // 👈 No slicing here
        });

    } catch (err) {
        console.error('Error in getRecommendedRoommates:', err);
        res.status(500).json({ message: 'Failed to generate recommendations' });
    }
};
