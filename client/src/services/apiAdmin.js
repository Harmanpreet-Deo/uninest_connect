// services/apiAdmin.js
import axios from 'axios';

const apiAdmin = axios.create({
    baseURL: 'http://localhost:5000/api/admin',
});

apiAdmin.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiAdmin;
