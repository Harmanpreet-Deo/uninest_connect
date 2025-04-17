import React, { useState } from 'react';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import { resetPassword } from '../../services/userService';

const PasswordReset = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [show, setShow] = useState({ current: false, new: false, confirm: false });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleMouseDown = (field) => setShow((prev) => ({ ...prev, [field]: true }));
    const handleMouseUp = (field) => setShow((prev) => ({ ...prev, [field]: false }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        if (newPassword !== confirmPassword) {
            return setError('New passwords do not match.');
        }

        try {
            setLoading(true);
            await resetPassword({ currentPassword, newPassword });
            setSuccess('Password updated successfully.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center">
            <div style={{ maxWidth: '600px', width: '100%' }} className="p-4 shadow bg-dark text-white rounded">
                <h5 className="mb-4 fw-bold">Reset Your Password</h5>

                {success && <Alert variant="success">{success}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={show.current ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                            <Button
                                variant="outline-secondary"
                                onMouseDown={() => handleMouseDown('current')}
                                onMouseUp={() => handleMouseUp('current')}
                                onMouseLeave={() => handleMouseUp('current')}
                            >
                                <FaEye />
                            </Button>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={show.new ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <Button
                                variant="outline-secondary"
                                onMouseDown={() => handleMouseDown('new')}
                                onMouseUp={() => handleMouseUp('new')}
                                onMouseLeave={() => handleMouseUp('new')}
                            >
                                <FaEye />
                            </Button>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={show.confirm ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <Button
                                variant="outline-secondary"
                                onMouseDown={() => handleMouseDown('confirm')}
                                onMouseUp={() => handleMouseUp('confirm')}
                                onMouseLeave={() => handleMouseUp('confirm')}
                            >
                                <FaEye />
                            </Button>
                        </InputGroup>
                    </Form.Group>

                    <Button type="submit" variant="outline-success" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default PasswordReset;
