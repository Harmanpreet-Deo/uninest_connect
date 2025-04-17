import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProfileForm from '../../components/forms/ProfileForm';
import './ProfileCreation.css';

function ProfileCreation() {
    return (
        <Container fluid className="min-vh-100 d-flex justify-content-center align-items-center px-4 bg-light">
            <Row className="w-100 align-items-center justify-content-center profile-create-wrapper shadow-lg rounded-4">
                {/* Left: Logo + Text */}
                <Col
                    md={5}
                    className="text-center p-4 left-logo-section d-none d-md-flex flex-column justify-content-center align-items-center border-end"
                >
                    <img
                        src="/uninest_logo_title.png"
                        alt="UniNest Connect Logo"
                        className="fade-in-logo"
                        style={{ width: '220px', marginBottom: '1rem' }}
                    />
                    <h4 className="fw-bold mb-1">Create Your Profile</h4>
                    <p className="text-muted mb-0">Get started with UniNest Connect</p>
                </Col>

                {/* Right: Form */}
                <Col md={7} sm={12} className="p-4 animate-fade-slide">
                    <ProfileForm />
                </Col>
            </Row>
        </Container>
    );
}

export default ProfileCreation;
