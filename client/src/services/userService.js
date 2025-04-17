import api from './api';

export const createUserProfile = async (formData, token) => {
    const { data } = await api.patch('/user/create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    });
    return data; // now returns full updated user
};

export const updateUserProfile = async (profileData, token) => {
    const { data } = await api.put('/user/update', profileData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};

export const getCurrentUser = async (token) => {
    const { data } = await api.get('/auth/me', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};

export const uploadProfilePhoto = async (formData, token) => {
    const { data } = await api.post('/user/upload-photo', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};

export const toggleLikeProfile = async (userId) => {
    const { data } = await api.patch(`/user/like/${userId}`);
    return data;
};

export const getUserById = async (id) => {
    const { data } = await api.get(`/user/${id}`);
    return data;
};

export const getLikedProfiles = async () => {
    const { data } = await api.get('/user/liked'); // no double /api/api
    return data;
};

// ✅ Toggle product save/unsave
export const toggleSaveProduct = async (productId) => {
    const { data } = await api.patch(`/user/products/save/${productId}`);
    return data;
};

// ✅ Fetch all saved products
export const getSavedProducts = async () => {
    const { data } = await api.get('/user/products/saved');
    return data;
};

export const getAllProducts = async () => {
    const { data } = await api.get('/products');
    return data;
};

// In userService.js
export const getAllListings = async () => {
    const { data } = await api.get('/listings');
    return data;
};

export const toggleSaveListing = async (listingId) => {
    const { data } = await api.patch(`/user/save-listing/${listingId}`);
    return data;
};

export const getSavedListings = async () => {
    const { data } = await api.get('/user/listings/saved');
    return data;
};

export const resetPassword = async ({ currentPassword, newPassword }) => {
    const { data } = await api.patch('/user/reset-password', { currentPassword, newPassword });
    return data;
};

export const submitRequest = async (requestData) => {
    const { data } = await api.post('/user/requests', requestData);
    return data;
};

export const requestListingVerification = async (formData) => {
    const { data } = await api.post('/user/request/verify-listing', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};

export const requestProfileVerification = async (formData) => {
    const { data } = await api.post('/user/request/verify-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};

export const getMyRequests = async () => {
    const { data } = await api.get('/user/requests/mine');
    return data;
};

export const validatePassword = async (password) => {
    const { data } = await api.post('/user/validate-password', { password });
    return data;
};

export const cancelDeleteRequest = async () => {
    const { data } = await api.delete('/user/cancel-delete-request');
    return data;
};
