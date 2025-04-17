import axios from './api';
import api from './api';

export const sendOtp = async (email, mode) => {
    const { data } = await axios.post('/auth/send-otp', { email, mode });
    return data.otp;
};

export const preLogin = async (email, password) => {
    return await axios.post('/auth/prelogin', { email, password });
};


export const verifyOtp = async (email, otp) => {
    await axios.post('/auth/verify-otp', { email, otp });
};

export const register = async (email, password) => {
    const { data } = await axios.post('/auth/register', { email, password });
    localStorage.setItem('token', data.token);
};

export const login = async (email, password) => {
    const { data } = await axios.post('/auth/login', { email, password });

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

// authService.js
export const sendResetOtp = async (email) => {
    const { data } = await axios.post('/auth/send-reset-otp', { email });
    return data;
};


export const resetPassword = async ({ email, newPassword }) => {
    const { data } = await axios.patch('/auth/reset-password', { email, newPassword });
    return data;
};
