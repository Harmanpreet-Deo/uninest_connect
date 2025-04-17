import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Spinner, InputGroup } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import {
    submitRequest,
    getMyRequests,
    validatePassword,
    cancelDeleteRequest,
} from '../../services/userService';

const DeleteAccountRequest = () => {
    const [loading, setLoading] = useState(true);
    const [alreadyRequested, setAlreadyRequested] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const checkExistingRequest = async () => {
            try {
                const requests = await getMyRequests();
                const existing = requests.find(
                    (r) => r.type === 'delete_account' && r.status === 'pending'
                );
                if (existing) setAlreadyRequested(true);
            } catch (err) {
                console.error('Error checking requests:', err);
            } finally {
                setLoading(false);
            }
        };

        checkExistingRequest();
    }, []);

    const handleCancel = async () => {
        try {
            await cancelDeleteRequest();
            setStatus('Your delete request has been cancelled.');
            setAlreadyRequested(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel request');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');
        setError('');

        if (!password) {
            return setError('Please enter your password to confirm.');
        }

        try {
            const valid = await validatePassword(password);
            if (!valid.success) {
                return setError('Password is incorrect.');
            }

            await submitRequest({ type: 'delete_account' });
            setStatus('Your account deletion request has been submitted.');
            setAlreadyRequested(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit deletion request.');
        }
    };

    if (loading) return <Spinner animation="border" variant="light" />;

    if (alreadyRequested) {
        return (
            <Alert variant="warning">
                You have already requested to delete your account. Please wait for admin review.
                <div className="mt-2">
                    <Button variant="outline-dark" size="sm" onClick={handleCancel}>
                        Cancel Request
                    </Button>
                </div>
            </Alert>
        );
    }

    return (
        <Form onSubmit={handleSubmit} className="text-white">
            {status && <Alert variant="success">{status}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Alert variant="danger">
                <strong>Warning:</strong> This action will permanently delete your account once approved by an admin. You will lose access to all your data.
            </Alert>

            <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup>
                    <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        variant="outline-secondary"
                        onMouseDown={() => setShowPassword(true)}
                        onMouseUp={() => setShowPassword(false)}
                        onMouseLeave={() => setShowPassword(false)}
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeSlash /> : <Eye />}
                    </Button>
                </InputGroup>
            </Form.Group>

            <Button type="submit" variant="danger">
                Request Account Deletion
            </Button>
        </Form>
    );
};

export default DeleteAccountRequest;
