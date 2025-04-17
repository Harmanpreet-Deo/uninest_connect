import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminRequests from './AdminRequests';
import './AdminDashboard.css';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <AdminSidebar />
            <div className="admin-main">
                <h3 className="fw-bold mb-4">Admin Panel - Requests</h3>
                <AdminRequests />
            </div>
        </div>
    );
};

export default AdminDashboard;
