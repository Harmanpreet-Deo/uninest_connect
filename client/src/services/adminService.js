// services/adminService.js
import apiAdmin from "./apiAdmin";

// ✅ Admin Login
export const adminLogin = async (credentials) => {
    const { data } = await apiAdmin.post('/login', credentials);
    localStorage.setItem('adminToken', data.token); // <-- Don't forget this here!
    return data;
};

// ✅ Get all admin requests
export const getAllAdminRequests = async () => {
    const { data } = await apiAdmin.get('/requests');
    return data;
};

// ✅ Update request status
export const updateRequestStatus = async (requestId, status) => {
    const { data } = await apiAdmin.patch(`/requests/${requestId}/status`, { status });
    return data;
};

// ✅ Delete entity by admin
export const deleteEntityByAdmin = async (type, id) => {
    const { data } = await apiAdmin.delete(`/delete/${type}/${id}`);
    return data;
};

// ✅ Logout
export const adminLogout = async () => {
    try {
        await apiAdmin.post('/logout');
    } catch (err) {
        console.warn('Logout failed (but proceeding):', err.message);
    } finally {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
    }
};

// ✅ Fetch individual entities
export const getUserByIdAdmin = async (id) => {
    const { data } = await apiAdmin.get(`/user/${id}`);
    return data;
};

export const getProductByIdAdmin = async (id) => {
    const { data } = await apiAdmin.get(`/product/${id}`);
    return data;
};

export const getListingByIdAdmin = async (id) => {
    const { data } = await apiAdmin.get(`/listing/${id}`);
    return data;
};
