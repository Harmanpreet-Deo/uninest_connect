import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AuthPage from './pages/auth/AuthPage';
import ProfileCreation from './pages/user/ProfileCreation';
import DashboardPage from './pages/user/DashboardPage';
import RoommateProfile from './pages/user/RoommateProfile';
import RedirectHandler from './routes/RedirectHandler';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminRequests from './pages/admin/AdminRequests';
import AdminUserListing from "./pages/admin/AdminUserListing";
import AdminUserProduct from "./pages/admin/AdminUserProduct";
import AdminUserProfile from "./pages/admin/AdminUserProfile";
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import NotFound from "./pages/NotFound";

import ProtectedRoute from './ProtectedRoute';
import AdminProtectedRoute from './AdminProtectedRoute'; // ✅ NEW

import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <Router>
            <ToastContainer position="top-center" autoClose={2000} />
            <Routes>
                {/* Public */}
                <Route path="/" element={<RedirectHandler />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

                {/* Protected User Routes */}
                <Route
                    path="/profile/create"
                    element={
                        <ProtectedRoute>
                            <ProfileCreation />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/roommates/profile/:id"
                    element={
                        <ProtectedRoute>
                            <RoommateProfile />
                        </ProtectedRoute>
                    }
                />

                {/* Admin login (public) */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin routes (require adminToken) */}
                <Route
                    path="/admin"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboard />
                        </AdminProtectedRoute>
                    }
                >
                    <Route index element={<AdminRequests />} />
                    <Route path="requests" element={<AdminRequests />} />
                </Route>

                {/* Admin detail pages */}
                <Route
                    path="/admin/user/:id"
                    element={
                        <AdminProtectedRoute>
                            <AdminUserProfile />
                        </AdminProtectedRoute>
                    }
                />
                <Route
                    path="/admin/product/:id"
                    element={
                        <AdminProtectedRoute>
                            <AdminUserProduct />
                        </AdminProtectedRoute>
                    }
                />
                <Route
                    path="/admin/listing/:id"
                    element={
                        <AdminProtectedRoute>
                            <AdminUserListing />
                        </AdminProtectedRoute>
                    }
                />

                {/* Not Found */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
