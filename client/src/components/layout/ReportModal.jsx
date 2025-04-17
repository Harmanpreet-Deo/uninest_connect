// components/common/ReportModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { submitRequest } from '../../services/userService';

const ReportModal = ({ show, onHide, type, targetId, targetLabel }) => {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');
        setError('');

        try {
            const payload = {
                type, // 'report_user', 'report_listing', or 'report_product'
                message,
            };

            // Attach target reference dynamically
            if (type === 'report_user') payload.targetUser = targetId;
            if (type === 'report_listing') payload.targetListing = targetId;
            if (type === 'report_product') payload.targetProduct = targetId;

            await submitRequest(payload);
            setStatus('Report submitted successfully!');
            setMessage('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit report.');
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="bg-dark text-white">
                <Modal.Title>Report {targetLabel}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-white">
                {status && <Alert variant="success">{status}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Why are you reporting this?</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" variant="danger">Submit Report</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ReportModal;
