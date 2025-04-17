import api from './api';

// ✅ Uses correct baseURL (https://uninest-connect.onrender.com/api)
export const sendOtp = async (email, mode) => {
    const { data } = await api.post('/auth/send-otp', { email, mode });
    return data.otp;
};

export const preLogin = async (email, password) => {
    return await api.post('/auth/prelogin', { email, password });
};

export const verifyOtp = async (email, otp) => {
    await api.post('/auth/verify-otp', { email, otp });
};

export const register = async (email, password) => {
    const { data } = await api.post('/auth/register', { email, password });
    localStorage.setItem('token', data.token);
};

export const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        fullName: data.fullName,
        email: data.email,
        isProfileComplete: data.isProfileComplete
    }));
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('activeSection');
    window.location.href = '/auth';
};

export const markProfileComplete = async () => {
    const token = localStorage.getItem('token');
    await api.patch('/auth/complete-profile', {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const sendResetOtp = async (email) => {
    const { data } = await api.post('/auth/send-reset-otp', { email });
    return data;
};

export const resetPassword = async ({ email, newPassword }) => {
    const { data } = await api.patch('/auth/reset-password', { email, newPassword });
    return data;
};
