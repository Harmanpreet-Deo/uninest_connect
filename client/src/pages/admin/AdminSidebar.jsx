import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAllAdminRequests, adminLogout } from '../../services/adminService'; // ✅ import logout
import './AdminSidebar.css';

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const data = await getAllAdminRequests();
                const pending = data.filter(r => r.status === 'pending');
                setPendingCount(pending.length);
            } catch (err) {
                console.error('Failed to fetch admin requests:', err);
            }
        };

        fetchPending();
    }, []);

    const handleLogout = async () => {
        try {
            await adminLogout();
            navigate('/admin/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <div className="admin-sidebar">
            <div className="logo">
                <img src="/uninest_white_title.png" alt="UniNest Logo" />
            </div>
            <Nav defaultActiveKey="/admin" className="flex-column w-100">
                <Nav.Link as={Link} to="/admin" active={location.pathname === '/admin'}>
                    Requests {pendingCount > 0 && <span className="badge bg-warning ms-2">{pendingCount}</span>}
                </Nav.Link>
                <Nav.Link as="button" className="nav-link logout text-danger" onClick={handleLogout}>
                    Logout
                </Nav.Link>
            </Nav>
        </div>
    );
};

export default AdminSidebar;
