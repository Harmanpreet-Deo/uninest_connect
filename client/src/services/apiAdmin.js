import axios from 'axios';

const apiAdmin = axios.create({
    baseURL: 'https://uninest-connect.onrender.com/apiadmin', // ⬅️ same here
});

apiAdmin.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiAdmin;
