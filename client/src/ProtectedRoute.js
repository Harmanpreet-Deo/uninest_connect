import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const location = useLocation();

    console.log('🔐 ProtectedRoute check:', user?.isProfileComplete, location.pathname);

    if (!token) return <Navigate to="/auth" replace />;
    if (!user.isProfileComplete && location.pathname !== '/profile/create') {
        return <Navigate to="/profile/create" replace />;
    }

    return children;
};


export default ProtectedRoute;
