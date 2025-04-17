import React from 'react';
import { Nav } from 'react-bootstrap';
import './SettingsNavbar.css'; // ✅ Import the CSS file

const SettingsNavbar = ({ active, setActive }) => {
    return (
        <Nav
            variant="tabs"
            activeKey={active}
            onSelect={(selectedKey) => setActive(selectedKey)}
            className="mb-3 settings-tabs"
        >
            <Nav.Item>
                <Nav.Link eventKey="password">Reset Password</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="support">Contact Support</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="verifyListing">Verify Listing</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="verifyProfile">Verify Profile</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="delete">Delete Account</Nav.Link>
            </Nav.Item>
        </Nav>
    );
};

export default SettingsNavbar;
