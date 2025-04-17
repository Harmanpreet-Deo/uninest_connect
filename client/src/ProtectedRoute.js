import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) return <Navigate to="/auth" replace />;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.isProfileComplete) return <Navigate to="/profile/create" replace />;

    return children;
};

export default ProtectedRoute;
