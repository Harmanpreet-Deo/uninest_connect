// services/adminService.js
import apiAdmin from "./apiAdmin";

// ✅ Admin Login
export const adminLogin = async (credentials) => {
    const { data } = await apiAdmin.post('/login', credentials);
    return data;
};

// ✅ Get all admin requests
export const getAllAdminRequests = async () => {
    const token = localStorage.getItem('adminToken');
    const { data } = await apiAdmin.get('/requests', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

// ✅ Update request status
export const updateRequestStatus = async (requestId, status) => {
    const token = localStorage.getItem('adminToken');
    const { data } = await apiAdmin.patch(`/requests/${requestId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

// ✅ Delete entity by admin
export const deleteEntityByAdmin = async (type, id) => {
    const token = localStorage.getItem('adminToken');
    const { data } = await apiAdmin.delete(`/delete/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

export const adminLogout = async () => {
    const token = localStorage.getItem('adminToken');
    await apiAdmin.post('/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
    });

    // ✅ Clear token locally
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login'; // or navigate programmatically
};


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
