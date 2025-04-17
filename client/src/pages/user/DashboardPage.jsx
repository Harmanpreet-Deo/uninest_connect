import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../../components/layout/Sidebar';
import Marketplace from "../../components/dashboard/Marketplace";
import SavedListings from "../../components/dashboard/SavedListings";
import ProfileSummary from '../../components/dashboard/ProfileSummary';
import YourListing from "../../components/dashboard/YourListing";
import YourProducts from '../../components/dashboard/YourProducts';
import RoommateFinder from '../../components/dashboard/RoommateFinder';
import LikedProfiles from "../../components/dashboard/LikedProfiles";
import SavedProducts from "../../components/dashboard/SavedProducts";
import BrowseListings from "../../components/dashboard/BrowseListings";
import SettingsPage from "./SettingsPage";

const DashboardPage = () => {
    const [activeSection, setActiveSection] = useState(() => {
        return localStorage.getItem('activeSection') || 'marketplace';
    });

    const handleSectionChange = (section) => {
        setActiveSection(section);
        localStorage.setItem('activeSection', section);
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'marketplace': return <Marketplace />;
            case 'yourListing': return <YourListing />;
            case 'saved-listings': return <SavedListings />;
            case 'profile': return <ProfileSummary />;
            case 'liked-Profiles': return <LikedProfiles />;
            case 'saved-Products': return <SavedProducts />;
            case 'yourProducts': return <YourProducts />;
            case 'roommate-finder': return <RoommateFinder />;
            case 'listings': return <BrowseListings />;
            case 'settings': return <SettingsPage />;
            default: return <Marketplace />;
        }
    };

    return (
        <Container fluid className="min-vh-100">
            <Row>
                <Col md={2} className="p-0 bg-light shadow-sm">
                    <Sidebar active={activeSection} setActive={handleSectionChange} />
                </Col>
                <Col
                    md={10}
                    className={`p-4 ${
                        activeSection === 'profile' ? 'd-flex justify-content-center align-items-center' : ''
                    }`}
                    style={activeSection === 'profile' ? { minHeight: '100vh' } : {}}
                >
                    {renderContent()}
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardPage;