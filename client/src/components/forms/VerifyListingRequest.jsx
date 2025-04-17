import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { requestListingVerification, getMyRequests } from '../../services/userService';
import { getMyListing } from "../../services/listingService";

const VerifyListingRequest = () => {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [hasPendingRequest, setHasPendingRequest] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const myListing = await getMyListing();
                setListing(myListing);

                const requests = await getMyRequests();
                const hasPending = requests.some(r => r.type === 'verify_listing' && r.status === 'pending');
                setHasPendingRequest(hasPending);
            } catch (err) {
                console.error('Listing or request check failed:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');
        setError('');

        if (!file) return setError('Please upload a proof of address document.');

        try {
            const formData = new FormData();
            formData.append('document', file);
            formData.append('listingId', listing._id);

            await requestListingVerification(formData);
            setStatus('Verification request submitted successfully!');
            setFile(null);
            setHasPendingRequest(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit request');
        }
    };

    if (loading) return <Spinner animation="border" variant="light" />;
    if (!listing) return <Alert variant="warning">You have no listing to verify.</Alert>;
    if (listing.isVerified) return <Alert variant="success">Your listing is already verified.</Alert>;
    if (hasPendingRequest) return <Alert variant="info">A verification request for your listing is already pending.</Alert>;

    return (
        <Form onSubmit={handleSubmit} className="text-white">
            {status && <Alert variant="success">{status}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-3">
                <Form.Label>Upload proof of address (PDF/Image)</Form.Label>
                <Form.Control
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />
            </Form.Group>

            <Button type="submit" variant="primary">Submit Verification</Button>
        </Form>
    );
};

export default VerifyListingRequest;
