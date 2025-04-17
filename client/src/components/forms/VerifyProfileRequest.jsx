import React, { useEffect, useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { requestProfileVerification, getUserById, getMyRequests } from '../../services/userService';
import { jwtDecode } from 'jwt-decode';

const VerifyProfileRequest = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [frontId, setFrontId] = useState(null);
    const [backId, setBackId] = useState(null);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserAndRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const decoded = jwtDecode(token);
                const userData = await getUserById(decoded.id);
                setUser(userData);

                const allRequests = await getMyRequests();
                const existingRequest = allRequests.find(r => r.type === 'verify_profile' && r.status === 'pending');
                if (existingRequest) {
                    setStatus('You have already submitted a verification request. Please wait for it to be reviewed.');
                }
            } catch (err) {
                console.error('Failed to load user/request data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndRequests();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setStatus('');

        if (!frontId || !backId) return setError('Please upload both front and back of your ID.');

        try {
            const formData = new FormData();
            formData.append('idFront', frontId);
            formData.append('idBack', backId);

            await requestProfileVerification(formData);
            setStatus('Verification request submitted successfully!');
            setFrontId(null);
            setBackId(null);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit verification.');
        }
    };

    if (loading) return <Spinner animation="border" variant="light" />;
    if (user?.isVerified) return <Alert variant="success">Your profile is already verified.</Alert>;
    if (status.includes('already submitted')) return <Alert variant="warning">{status}</Alert>;

    return (
        <Form onSubmit={handleSubmit} className="text-white">
            {status && <Alert variant="success">{status}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-3">
                <Form.Label>Front of ID</Form.Label>
                <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFrontId(e.target.files[0])}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Back of ID</Form.Label>
                <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBackId(e.target.files[0])}
                    required
                />
            </Form.Group>

            <Button type="submit" variant="primary">Submit Verification</Button>
        </Form>
    );
};

export default VerifyProfileRequest;
