// 🔹 Assign higher weights to certain fields
const weights = {
    campus: 2,
    gender: 2,
    foodPreference: 2,
    socialPreference: 2,
    sleepSchedule: 2,
    studyStyle: 2,
    smoking: 2,
    drinking: 2,
    guestFriendly: 2,
    hobbies: 1,
    languagesSpoken: 1,
    budget: 2
};

// 🔹 Normalize text-based fields
const normalize = (val) => {
    return typeof val === 'string' ? val.trim().toLowerCase() : val;
};

// 🔹 Generate user vector
export const generateUserVector = (user) => {
    const vector = [];

    for (let field in weights) {
        const value = normalize(user[field]);

        if (typeof value === 'boolean') {
            vector.push(value ? 1 : 0);
        } else if (typeof value === 'number') {
            // Normalize budget: divide by 1000 to keep values between 0-4
            vector.push(field === 'budget' ? Math.min(value / 1000, 5) : value);
        } else {
            // One-hot-style value (hashed charCode or mapped string)
            let code = 0;
            if (typeof value === 'string' && value.length > 0) {
                code = value.charCodeAt(0) % 10;
            }
            vector.push(code);
        }

        // Apply weight
        const weight = weights[field] || 1;
        for (let i = 1; i < weight; i++) {
            vector.push(vector[vector.length - 1]); // repeat for weight
        }
    }

    return vector;
};

// 🔹 Cosine similarity
export const calculateCosineSimilarity = (a, b) => {
    let dot = 0, magA = 0, magB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        magA += a[i] ** 2;
        magB += b[i] ** 2;
    }

    if (magA === 0 || magB === 0) return 0;
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};
