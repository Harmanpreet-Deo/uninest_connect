import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const location = useLocation();

    // Not logged in
    if (!token) return <Navigate to="/auth" replace />;

    // Trying to access anything other than profile creation but profile is incomplete
    if (!user.isProfileComplete && location.pathname !== '/profile/create') {
        return <Navigate to="/profile/create" replace />;
    }

    return children;
};

export default ProtectedRoute;
