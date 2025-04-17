import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Container className="text-center d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <h1 className="display-4 text-danger">404</h1>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="text-muted mb-4">The page you’re looking for doesn’t exist or was moved.</p>
            <Button variant="primary" onClick={() => navigate('/')}>
                Go Home
            </Button>
        </Container>
    );
};

export default NotFound;
