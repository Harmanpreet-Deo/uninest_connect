import React, { useState } from 'react';
import { Container, Card, Nav } from 'react-bootstrap';
import LoginForm from '../../components/forms/LoginForm';
import RegisterForm from '../../components/forms/RegisterForm';

function AuthPage() {
    const [activeTab, setActiveTab] = useState('login');

    const handleTabChange = (selectedKey) => {
        setActiveTab(selectedKey);
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card
                className="shadow-lg p-4"
                style={{
                    maxWidth: '500px',
                    width: '100%',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    color: '#121212',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                }}
            >
                {/* Logo Section */}
                <div className="text-center mb-4">
                    <img
                        src="/uninest_logo_title.png"
                        alt="UniNest Connect Logo"
                        style={{
                            maxWidth: '220px',
                            height: 'auto',
                            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.1))',
                        }}
                    />
                </div>

                <Nav
                    variant="tabs"
                    activeKey={activeTab}
                    onSelect={handleTabChange}
                    className="mb-4 justify-content-center"
                >
                    <Nav.Item>
                        <Nav.Link
                            eventKey="login"
                            style={{
                                backgroundColor: '#ffffff',
                                color: activeTab === 'login' ? '#343a40' : '#888',
                                fontWeight: activeTab === 'login' ? '600' : '400',
                                borderBottom: activeTab === 'login'
                                    ? '2px solid #343a40'
                                    : '1px solid #e0e0e0',
                            }}
                        >
                            Login
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            eventKey="register"
                            style={{
                                backgroundColor: '#ffffff',
                                color: activeTab === 'register' ? '#343a40' : '#888',
                                fontWeight: activeTab === 'register' ? '600' : '400',
                                borderBottom: activeTab === 'register'
                                    ? '2px solid #343a40'
                                    : '1px solid #e0e0e0',
                            }}
                        >
                            Register
                        </Nav.Link>
                    </Nav.Item>
                </Nav>


                {/* Forms */}
                <Card.Body className="pt-0">
                    {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AuthPage;
