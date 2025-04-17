import React from 'react';
import { Nav } from 'react-bootstrap';
import './Sidebar.css';
import { logout } from '../../services/authService';

const Sidebar = ({ active, setActive }) => {
    return (
        <div className="d-flex flex-column p-3 vh-100 sidebar">
            <div className="text-center mb-4">
                <img
                    src="/uninest_white_title.png"
                    alt="UniNest Logo"
                    style={{ width: '140px', marginBottom: '10px' }}
                />
            </div>
            <Nav
                variant="pills"
                className="flex-column"
                activeKey={active}
                onSelect={(selectedKey) => setActive(selectedKey)}
            >
                <Nav.Item>
                    <Nav.Link eventKey="profile">My Profile</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="marketplace">Marketplace</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="yourProducts">Your Products</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="saved-Products">Wishlist</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="listings">Browse Listings</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="yourListing">Your Listing</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="saved-listings">Saved Listings</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="roommate-finder">Roommate Finder</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="liked-Profiles">Liked Profiles</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="settings">Settings</Nav.Link>
                </Nav.Item>
            </Nav>
            <hr />
            <button className="btn btn-danger w-100 mt-auto" onClick={logout}>Logout</button>
        </div>
    );
};

export default Sidebar;
